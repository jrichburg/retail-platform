using System.Text.Json;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Infrastructure.Persistence;
using Modules.Catalog.Domain.Entities;
using Modules.Inventory.Application.Commands.DecrementStock;
using Modules.Sales.Application.Dtos;
using Modules.Sales.Domain.Entities;
using Modules.Tenants.Domain.Entities;
using SharedKernel;
using SharedKernel.Application;

namespace Modules.Sales.Application.Commands.CreateSale;

public class CreateSaleCommandHandler : ICommandHandler<CreateSaleCommand, SaleDto>
{
    private readonly AppDbContext _db;
    private readonly IMediator _mediator;
    private readonly ITenantContext _tenantContext;
    private readonly ICurrentUser _currentUser;

    public CreateSaleCommandHandler(AppDbContext db, IMediator mediator, ITenantContext tenantContext, ICurrentUser currentUser)
    {
        _db = db;
        _mediator = mediator;
        _tenantContext = tenantContext;
        _currentUser = currentUser;
    }

    public async Task<Result<SaleDto>> Handle(CreateSaleCommand request, CancellationToken cancellationToken)
    {
        // Idempotency check
        if (request.ClientTransactionId.HasValue)
        {
            var existing = await _db.Set<Sale>()
                .Include(s => s.LineItems)
                .Include(s => s.Tenders)
                .FirstOrDefaultAsync(s => s.Id == request.ClientTransactionId.Value, cancellationToken);

            if (existing != null)
                return Result.Success(MapToDto(existing));
        }

        // Look up products
        var productIds = request.Items.Select(i => i.ProductId).ToList();
        var products = await _db.Set<Product>()
            .AsNoTracking()
            .Where(p => productIds.Contains(p.Id) && p.IsActive)
            .ToDictionaryAsync(p => p.Id, cancellationToken);

        foreach (var item in request.Items)
        {
            if (!products.ContainsKey(item.ProductId))
                return Result.Failure<SaleDto>($"Product {item.ProductId} not found or inactive.");
        }

        // Get tax rate from tenant settings
        var taxSetting = await _db.Set<TenantSetting>()
            .AsNoTracking()
            .FirstOrDefaultAsync(s => s.TenantNodeId == _tenantContext.TenantNodeId && s.SettingsKey == "tax_rate", cancellationToken);

        decimal taxRate = 0.08m; // default
        if (taxSetting != null)
        {
            try
            {
                var taxDoc = JsonDocument.Parse(taxSetting.SettingsValue);
                if (taxDoc.RootElement.TryGetProperty("rate", out var rateElement))
                    taxRate = rateElement.GetDecimal();
            }
            catch { /* use default */ }
        }

        // Build line items
        var lineItems = new List<SaleLineItem>();
        decimal subtotal = 0;

        foreach (var item in request.Items)
        {
            var product = products[item.ProductId];
            var lineTotal = product.RetailPrice * item.Quantity;
            subtotal += lineTotal;

            lineItems.Add(new SaleLineItem
            {
                ProductId = product.Id,
                Sku = product.Sku,
                ProductName = product.Name,
                Quantity = item.Quantity,
                UnitPrice = product.RetailPrice,
                LineTotal = lineTotal,
                DiscountAmount = 0,
            });
        }

        var taxAmount = Math.Round(subtotal * taxRate, 2);
        var totalAmount = subtotal + taxAmount;

        // Validate tenders cover the total
        var tenderedAmount = request.Tenders.Sum(t => t.Amount);
        if (tenderedAmount < totalAmount)
            return Result.Failure<SaleDto>($"Tendered amount ({tenderedAmount:C}) is less than total ({totalAmount:C}).");

        // Generate transaction number
        var today = DateTime.UtcNow.Date;
        var store = await _db.Set<TenantNode>()
            .AsNoTracking()
            .FirstOrDefaultAsync(n => n.Id == _tenantContext.TenantNodeId, cancellationToken);

        var storeCode = store?.Code ?? "POS";
        var todayCount = await _db.Set<Sale>()
            .CountAsync(s => s.TenantNodeId == _tenantContext.TenantNodeId && s.TransactionDate >= today, cancellationToken);

        var transactionNumber = $"{storeCode}-{DateTime.UtcNow:yyyyMMdd}-{(todayCount + 1):D4}";

        // Create sale
        var sale = new Sale
        {
            Id = request.ClientTransactionId ?? Guid.NewGuid(),
            TenantNodeId = _tenantContext.TenantNodeId,
            RootTenantId = _tenantContext.RootTenantId,
            TransactionNumber = transactionNumber,
            TransactionDate = DateTime.UtcNow,
            Status = "completed",
            Subtotal = subtotal,
            TaxRate = taxRate,
            TaxAmount = taxAmount,
            TotalAmount = totalAmount,
            TenderedAmount = tenderedAmount,
            ChangeAmount = tenderedAmount - totalAmount,
            CashierId = _currentUser.UserId != Guid.Empty ? _currentUser.UserId : null,
        };

        foreach (var li in lineItems)
        {
            li.SaleId = sale.Id;
            sale.LineItems.Add(li);
        }

        foreach (var tender in request.Tenders)
        {
            sale.Tenders.Add(new SaleTender
            {
                SaleId = sale.Id,
                TenderType = tender.TenderType,
                Amount = tender.Amount,
            });
        }

        _db.Set<Sale>().Add(sale);
        await _db.SaveChangesAsync(cancellationToken);

        // Decrement inventory for each line item via MediatR
        foreach (var li in lineItems)
        {
            await _mediator.Send(new DecrementStockCommand(
                li.ProductId, li.Quantity, sale.Id,
                _tenantContext.TenantNodeId, _tenantContext.RootTenantId
            ), cancellationToken);
        }

        return Result.Success(MapToDto(sale));
    }

    private static SaleDto MapToDto(Sale sale) => new()
    {
        Id = sale.Id,
        TransactionNumber = sale.TransactionNumber,
        TransactionDate = sale.TransactionDate,
        Status = sale.Status,
        Subtotal = sale.Subtotal,
        TaxRate = sale.TaxRate,
        TaxAmount = sale.TaxAmount,
        TotalAmount = sale.TotalAmount,
        TenderedAmount = sale.TenderedAmount,
        ChangeAmount = sale.ChangeAmount,
        LineItems = sale.LineItems.Select(li => new SaleLineItemDto
        {
            ProductId = li.ProductId,
            Sku = li.Sku,
            ProductName = li.ProductName,
            Quantity = li.Quantity,
            UnitPrice = li.UnitPrice,
            LineTotal = li.LineTotal,
            DiscountAmount = li.DiscountAmount,
        }).ToList(),
        Tenders = sale.Tenders.Select(t => new SaleTenderDto
        {
            TenderType = t.TenderType,
            Amount = t.Amount,
            PaymentReference = t.PaymentReference,
        }).ToList(),
    };
}
