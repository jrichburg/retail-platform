using Microsoft.EntityFrameworkCore;
using Infrastructure.Persistence;
using Modules.Uniforms.Domain.Entities;
using SharedKernel;
using SharedKernel.Application;

namespace Modules.Uniforms.Application.Commands.CompleteWorkOrder;

public class CompleteWorkOrderCommandHandler : ICommandHandler<CompleteWorkOrderCommand>
{
    private readonly AppDbContext _db;

    public CompleteWorkOrderCommandHandler(AppDbContext db)
    {
        _db = db;
    }

    public async Task<Result> Handle(CompleteWorkOrderCommand request, CancellationToken cancellationToken)
    {
        var wo = await _db.Set<WorkOrder>()
            .FirstOrDefaultAsync(w => w.Id == request.Id, cancellationToken);

        if (wo == null) return Result.Failure("Work order not found.");
        if (wo.Status != "in_progress") return Result.Failure("Only in-progress work orders can be completed.");

        wo.Status = "completed";
        await _db.SaveChangesAsync(cancellationToken);
        return Result.Success();
    }
}
