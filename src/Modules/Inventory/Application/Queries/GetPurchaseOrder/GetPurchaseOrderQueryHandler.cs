using Microsoft.EntityFrameworkCore;
using Infrastructure.Persistence;
using Modules.Inventory.Application.Dtos;
using Modules.Inventory.Domain.Entities;
using SharedKernel;
using SharedKernel.Application;

namespace Modules.Inventory.Application.Queries.GetPurchaseOrder;

public class GetPurchaseOrderQueryHandler : IQueryHandler<GetPurchaseOrderQuery, PurchaseOrderDetailDto>
{
    private readonly AppDbContext _db;

    public GetPurchaseOrderQueryHandler(AppDbContext db)
    {
        _db = db;
    }

    public async Task<Result<PurchaseOrderDetailDto>> Handle(GetPurchaseOrderQuery request, CancellationToken cancellationToken)
    {
        var po = await _db.Set<PurchaseOrder>()
            .AsNoTracking()
            .Include(p => p.Lines)
            .Where(p => p.Id == request.Id)
            .Select(p => new PurchaseOrderDetailDto
            {
                Id = p.Id,
                OrderNumber = p.OrderNumber,
                SupplierId = p.SupplierId,
                SupplierName = p.SupplierName,
                Status = p.Status,
                Notes = p.Notes,
                ExpectedDate = p.ExpectedDate,
                TotalCost = p.TotalCost,
                CreatedAt = p.CreatedAt,
                Lines = p.Lines.Select(l => new PurchaseOrderLineDto
                {
                    Id = l.Id,
                    ProductId = l.ProductId,
                    ProductVariantId = l.ProductVariantId,
                    ProductName = l.ProductName,
                    Sku = l.Sku,
                    VariantDescription = l.VariantDescription,
                    QuantityOrdered = l.QuantityOrdered,
                    QuantityReceived = l.QuantityReceived,
                    UnitCost = l.UnitCost,
                    LineCost = l.QuantityOrdered * l.UnitCost,
                }).ToList(),
            })
            .FirstOrDefaultAsync(cancellationToken);

        if (po == null) return Result.Failure<PurchaseOrderDetailDto>("Purchase order not found.");
        return Result.Success(po);
    }
}
