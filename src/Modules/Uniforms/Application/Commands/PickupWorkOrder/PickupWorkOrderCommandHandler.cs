using Microsoft.EntityFrameworkCore;
using Infrastructure.Persistence;
using Modules.Uniforms.Domain.Entities;
using SharedKernel;
using SharedKernel.Application;

namespace Modules.Uniforms.Application.Commands.PickupWorkOrder;

public class PickupWorkOrderCommandHandler : ICommandHandler<PickupWorkOrderCommand>
{
    private readonly AppDbContext _db;

    public PickupWorkOrderCommandHandler(AppDbContext db)
    {
        _db = db;
    }

    public async Task<Result> Handle(PickupWorkOrderCommand request, CancellationToken cancellationToken)
    {
        var wo = await _db.Set<WorkOrder>()
            .FirstOrDefaultAsync(w => w.Id == request.Id, cancellationToken);

        if (wo == null) return Result.Failure("Work order not found.");
        if (wo.Status != "completed") return Result.Failure("Only completed work orders can be marked as picked up.");

        wo.Status = "picked_up";
        await _db.SaveChangesAsync(cancellationToken);
        return Result.Success();
    }
}
