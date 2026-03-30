using Microsoft.EntityFrameworkCore;
using Infrastructure.Persistence;
using Modules.Inventory.Application.Dtos;
using Modules.Inventory.Domain.Entities;
using SharedKernel;
using SharedKernel.Application;

namespace Modules.Inventory.Application.Queries.GetPurchaseOrders;

public class GetPurchaseOrdersQueryHandler : IQueryHandler<GetPurchaseOrdersQuery, PagedResult<PurchaseOrderDto>>
{
    private readonly AppDbContext _db;

    public GetPurchaseOrdersQueryHandler(AppDbContext db)
    {
        _db = db;
    }

    public async Task<Result<PagedResult<PurchaseOrderDto>>> Handle(GetPurchaseOrdersQuery request, CancellationToken cancellationToken)
    {
        var query = _db.Set<PurchaseOrder>()
            .AsNoTracking()
            .Include(p => p.Lines)
            .AsQueryable();

        if (!string.IsNullOrWhiteSpace(request.Status))
            query = query.Where(p => p.Status == request.Status);
        if (request.SupplierId.HasValue)
            query = query.Where(p => p.SupplierId == request.SupplierId.Value);

        var totalCount = await query.CountAsync(cancellationToken);
        var items = await query
            .OrderByDescending(p => p.CreatedAt)
            .Skip((request.Page - 1) * request.PageSize)
            .Take(request.PageSize)
            .Select(p => new PurchaseOrderDto
            {
                Id = p.Id,
                OrderNumber = p.OrderNumber,
                SupplierId = p.SupplierId,
                SupplierName = p.SupplierName,
                Status = p.Status,
                Notes = p.Notes,
                ExpectedDate = p.ExpectedDate,
                TotalCost = p.TotalCost,
                LineCount = p.Lines.Count,
                TotalUnitsOrdered = p.Lines.Sum(l => l.QuantityOrdered),
                TotalUnitsReceived = p.Lines.Sum(l => l.QuantityReceived),
                CreatedAt = p.CreatedAt,
            })
            .ToListAsync(cancellationToken);

        return Result.Success(new PagedResult<PurchaseOrderDto>
        {
            Items = items,
            TotalCount = totalCount,
            Page = request.Page,
            PageSize = request.PageSize,
        });
    }
}
