using Microsoft.EntityFrameworkCore;
using Infrastructure.Persistence;
using Modules.Uniforms.Domain.Entities;
using SharedKernel;
using SharedKernel.Application;

namespace Modules.Uniforms.Application.Commands.StartWorkOrder;

public class StartWorkOrderCommandHandler : ICommandHandler<StartWorkOrderCommand>
{
    private readonly AppDbContext _db;

    public StartWorkOrderCommandHandler(AppDbContext db)
    {
        _db = db;
    }

    public async Task<Result> Handle(StartWorkOrderCommand request, CancellationToken cancellationToken)
    {
        var wo = await _db.Set<WorkOrder>()
            .FirstOrDefaultAsync(w => w.Id == request.Id, cancellationToken);

        if (wo == null) return Result.Failure("Work order not found.");
        if (wo.Status != "submitted") return Result.Failure("Only submitted work orders can be started.");

        wo.Status = "in_progress";
        await _db.SaveChangesAsync(cancellationToken);
        return Result.Success();
    }
}
