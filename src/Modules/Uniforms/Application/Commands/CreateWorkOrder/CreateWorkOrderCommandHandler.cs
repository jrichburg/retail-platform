using Microsoft.EntityFrameworkCore;
using Infrastructure.Persistence;
using Modules.Uniforms.Domain.Entities;
using SharedKernel;
using SharedKernel.Application;

namespace Modules.Uniforms.Application.Commands.CreateWorkOrder;

public class CreateWorkOrderCommandHandler : ICommandHandler<CreateWorkOrderCommand, Guid>
{
    private readonly AppDbContext _db;
    private readonly ITenantContext _tenantContext;

    public CreateWorkOrderCommandHandler(AppDbContext db, ITenantContext tenantContext)
    {
        _db = db;
        _tenantContext = tenantContext;
    }

    public async Task<Result<Guid>> Handle(CreateWorkOrderCommand request, CancellationToken cancellationToken)
    {
        var today = DateTime.UtcNow.Date;
        var todayCount = await _db.Set<WorkOrder>()
            .CountAsync(w => w.TenantNodeId == _tenantContext.TenantNodeId && w.CreatedAt >= today, cancellationToken);
        var orderNumber = $"WO-{DateTime.UtcNow:yyyyMMdd}-{(todayCount + 1):D3}";

        var wo = new WorkOrder
        {
            OrderNumber = orderNumber,
            CustomerId = request.CustomerId,
            CustomerName = request.CustomerName,
            CustomerPhone = request.CustomerPhone,
            CustomerEmail = request.CustomerEmail,
            Status = "draft",
            DueDate = request.DueDate,
            Notes = request.Notes,
            TenantNodeId = _tenantContext.TenantNodeId,
            RootTenantId = _tenantContext.RootTenantId,
        };

        decimal totalAmount = 0;
        foreach (var line in request.Lines)
        {
            var lineTotal = line.Quantity * line.UnitPrice;
            totalAmount += lineTotal;
            wo.Lines.Add(new WorkOrderLine
            {
                Description = line.Description,
                ProductVariantId = line.ProductVariantId,
                ProductName = line.ProductName,
                Sku = line.Sku,
                Quantity = line.Quantity,
                UnitPrice = line.UnitPrice,
            });
        }

        wo.TotalAmount = totalAmount;
        _db.Set<WorkOrder>().Add(wo);
        await _db.SaveChangesAsync(cancellationToken);

        return Result.Success(wo.Id);
    }
}
