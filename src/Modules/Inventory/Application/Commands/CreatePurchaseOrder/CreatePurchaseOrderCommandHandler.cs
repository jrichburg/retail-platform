using Microsoft.EntityFrameworkCore;
using Infrastructure.Persistence;
using Modules.Inventory.Domain.Entities;
using SharedKernel;
using SharedKernel.Application;

namespace Modules.Inventory.Application.Commands.CreatePurchaseOrder;

public class CreatePurchaseOrderCommandHandler : ICommandHandler<CreatePurchaseOrderCommand, Guid>
{
    private readonly AppDbContext _db;
    private readonly ITenantContext _tenantContext;

    public CreatePurchaseOrderCommandHandler(AppDbContext db, ITenantContext tenantContext)
    {
        _db = db;
        _tenantContext = tenantContext;
    }

    public async Task<Result<Guid>> Handle(CreatePurchaseOrderCommand request, CancellationToken cancellationToken)
    {
        var today = DateTime.UtcNow.Date;
        var todayCount = await _db.Set<PurchaseOrder>()
            .CountAsync(p => p.TenantNodeId == _tenantContext.TenantNodeId && p.CreatedAt >= today, cancellationToken);
        var orderNumber = $"PO-{DateTime.UtcNow:yyyyMMdd}-{(todayCount + 1):D3}";

        var po = new PurchaseOrder
        {
            OrderNumber = orderNumber,
            SupplierId = request.SupplierId,
            SupplierName = request.SupplierName,
            Status = "draft",
            Notes = request.Notes,
            ExpectedDate = request.ExpectedDate,
            TenantNodeId = _tenantContext.TenantNodeId,
            RootTenantId = _tenantContext.RootTenantId,
        };

        decimal totalCost = 0;
        foreach (var line in request.Lines)
        {
            var lineCost = line.QuantityOrdered * line.UnitCost;
            totalCost += lineCost;
            po.Lines.Add(new PurchaseOrderLine
            {
                ProductId = line.ProductId,
                ProductVariantId = line.ProductVariantId,
                ProductName = line.ProductName,
                Sku = line.Sku,
                VariantDescription = line.VariantDescription,
                QuantityOrdered = line.QuantityOrdered,
                QuantityReceived = 0,
                UnitCost = line.UnitCost,
            });
        }

        po.TotalCost = totalCost;
        _db.Set<PurchaseOrder>().Add(po);
        await _db.SaveChangesAsync(cancellationToken);

        return Result.Success(po.Id);
    }
}
