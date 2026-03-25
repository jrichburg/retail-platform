using Microsoft.EntityFrameworkCore;
using Infrastructure.Persistence;
using Modules.Sales.Application.Dtos;
using Modules.Sales.Domain.Entities;
using SharedKernel;
using SharedKernel.Application;

namespace Modules.Sales.Application.Queries.GetSales;

public class GetSalesQueryHandler : IQueryHandler<GetSalesQuery, PagedResult<SaleDto>>
{
    private readonly AppDbContext _db;

    public GetSalesQueryHandler(AppDbContext db)
    {
        _db = db;
    }

    public async Task<Result<PagedResult<SaleDto>>> Handle(GetSalesQuery request, CancellationToken cancellationToken)
    {
        var query = _db.Set<Sale>()
            .AsNoTracking()
            .Include(s => s.LineItems)
            .Include(s => s.Tenders)
            .AsQueryable();

        if (request.From.HasValue)
            query = query.Where(s => s.TransactionDate >= request.From.Value);
        if (request.To.HasValue)
            query = query.Where(s => s.TransactionDate <= request.To.Value);
        if (!string.IsNullOrWhiteSpace(request.Status))
            query = query.Where(s => s.Status == request.Status);

        var totalCount = await query.CountAsync(cancellationToken);
        var items = await query
            .OrderByDescending(s => s.TransactionDate)
            .Skip((request.Page - 1) * request.PageSize)
            .Take(request.PageSize)
            .Select(s => new SaleDto
            {
                Id = s.Id,
                TransactionNumber = s.TransactionNumber,
                TransactionDate = s.TransactionDate,
                Status = s.Status,
                Subtotal = s.Subtotal,
                TaxRate = s.TaxRate,
                TaxAmount = s.TaxAmount,
                TotalAmount = s.TotalAmount,
                TenderedAmount = s.TenderedAmount,
                ChangeAmount = s.ChangeAmount,
                LineItems = s.LineItems.Select(li => new SaleLineItemDto
                {
                    ProductId = li.ProductId,
                    Sku = li.Sku,
                    ProductName = li.ProductName,
                    Quantity = li.Quantity,
                    UnitPrice = li.UnitPrice,
                    LineTotal = li.LineTotal,
                    DiscountAmount = li.DiscountAmount,
                }).ToList(),
                Tenders = s.Tenders.Select(t => new SaleTenderDto
                {
                    TenderType = t.TenderType,
                    Amount = t.Amount,
                    PaymentReference = t.PaymentReference,
                }).ToList(),
            })
            .ToListAsync(cancellationToken);

        return Result.Success(new PagedResult<SaleDto>
        {
            Items = items,
            TotalCount = totalCount,
            Page = request.Page,
            PageSize = request.PageSize,
        });
    }
}
