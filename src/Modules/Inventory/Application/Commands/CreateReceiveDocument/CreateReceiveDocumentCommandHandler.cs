using Microsoft.EntityFrameworkCore;
using Infrastructure.Persistence;
using Modules.Inventory.Domain.Entities;
using SharedKernel;
using SharedKernel.Application;

namespace Modules.Inventory.Application.Commands.CreateReceiveDocument;

public class CreateReceiveDocumentCommandHandler : ICommandHandler<CreateReceiveDocumentCommand, Guid>
{
    private readonly AppDbContext _db;
    private readonly ITenantContext _tenantContext;

    public CreateReceiveDocumentCommandHandler(AppDbContext db, ITenantContext tenantContext)
    {
        _db = db;
        _tenantContext = tenantContext;
    }

    public async Task<Result<Guid>> Handle(CreateReceiveDocumentCommand request, CancellationToken cancellationToken)
    {
        // Generate document number
        var today = DateTime.UtcNow.Date;
        var todayCount = await _db.Set<ReceiveDocument>()
            .CountAsync(d => d.TenantNodeId == _tenantContext.TenantNodeId && d.CreatedAt >= today, cancellationToken);
        var docNumber = $"RCV-{DateTime.UtcNow:yyyyMMdd}-{(todayCount + 1):D3}";

        var document = new ReceiveDocument
        {
            DocumentNumber = docNumber,
            PurchaseOrderId = null,
            Status = "completed",
            Notes = request.Notes,
            TenantNodeId = _tenantContext.TenantNodeId,
            RootTenantId = _tenantContext.RootTenantId,
        };

        // Process each line: create document line + update stock
        foreach (var line in request.Lines)
        {
            document.Lines.Add(new ReceiveDocumentLine
            {
                ProductId = line.ProductId,
                ProductVariantId = line.ProductVariantId,
                ProductName = line.ProductName,
                Sku = line.Sku,
                Upc = line.Upc,
                VariantDescription = line.VariantDescription,
                Quantity = line.Quantity,
            });

            // Upsert stock level
            var stockLevel = await _db.Set<StockLevel>()
                .FirstOrDefaultAsync(s =>
                    s.TenantNodeId == _tenantContext.TenantNodeId &&
                    s.ProductId == line.ProductId &&
                    s.ProductVariantId == line.ProductVariantId,
                    cancellationToken);

            if (stockLevel == null)
            {
                stockLevel = new StockLevel
                {
                    TenantNodeId = _tenantContext.TenantNodeId,
                    RootTenantId = _tenantContext.RootTenantId,
                    ProductId = line.ProductId,
                    ProductVariantId = line.ProductVariantId,
                    QuantityOnHand = line.Quantity,
                };
                _db.Set<StockLevel>().Add(stockLevel);
            }
            else
            {
                stockLevel.QuantityOnHand += line.Quantity;
            }

            // Create stock transaction
            _db.Set<StockTransaction>().Add(new StockTransaction
            {
                TenantNodeId = _tenantContext.TenantNodeId,
                RootTenantId = _tenantContext.RootTenantId,
                ProductId = line.ProductId,
                ProductVariantId = line.ProductVariantId,
                TransactionType = "received",
                Quantity = line.Quantity,
                RunningBalance = stockLevel.QuantityOnHand,
                Reference = docNumber,
                Notes = $"Blind receive: {line.ProductName} ({line.VariantDescription ?? "default"})",
            });
        }

        _db.Set<ReceiveDocument>().Add(document);
        await _db.SaveChangesAsync(cancellationToken);

        return Result.Success(document.Id);
    }
}
