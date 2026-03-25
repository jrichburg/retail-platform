using Microsoft.EntityFrameworkCore;
using Infrastructure.Persistence;
using Modules.Sales.Application.Dtos;
using Modules.Sales.Domain.Entities;
using SharedKernel;
using SharedKernel.Application;

namespace Modules.Sales.Application.Queries.GetSale;

public class GetSaleQueryHandler : IQueryHandler<GetSaleQuery, SaleDto>
{
    private readonly AppDbContext _db;

    public GetSaleQueryHandler(AppDbContext db)
    {
        _db = db;
    }

    public async Task<Result<SaleDto>> Handle(GetSaleQuery request, CancellationToken cancellationToken)
    {
        var sale = await _db.Set<Sale>()
            .AsNoTracking()
            .Include(s => s.LineItems)
            .Include(s => s.Tenders)
            .FirstOrDefaultAsync(s => s.Id == request.Id, cancellationToken);

        if (sale == null)
            return Result.Failure<SaleDto>("Sale not found.");

        return Result.Success(new SaleDto
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
        });
    }
}
