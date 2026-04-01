using Microsoft.EntityFrameworkCore;
using Infrastructure.Persistence;
using Modules.Uniforms.Domain.Entities;
using SharedKernel;
using SharedKernel.Application;

namespace Modules.Uniforms.Application.Commands.UpdateWorkOrder;

public class UpdateWorkOrderCommandHandler : ICommandHandler<UpdateWorkOrderCommand>
{
    private readonly AppDbContext _db;

    public UpdateWorkOrderCommandHandler(AppDbContext db)
    {
        _db = db;
    }

    public async Task<Result> Handle(UpdateWorkOrderCommand request, CancellationToken cancellationToken)
    {
        var wo = await _db.Set<WorkOrder>()
            .Include(w => w.Lines)
            .FirstOrDefaultAsync(w => w.Id == request.Id, cancellationToken);

        if (wo == null) return Result.Failure("Work order not found.");
        if (wo.Status != "draft") return Result.Failure("Only draft work orders can be edited.");

        wo.CustomerId = request.CustomerId;
        wo.CustomerName = request.CustomerName;
        wo.CustomerPhone = request.CustomerPhone;
        wo.CustomerEmail = request.CustomerEmail;
        wo.DueDate = request.DueDate;
        wo.Notes = request.Notes;

        _db.Set<WorkOrderLine>().RemoveRange(wo.Lines);
        wo.Lines.Clear();

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

        await _db.SaveChangesAsync(cancellationToken);
        return Result.Success();
    }
}
