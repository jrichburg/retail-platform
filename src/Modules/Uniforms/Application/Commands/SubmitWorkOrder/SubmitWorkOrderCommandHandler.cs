using Microsoft.EntityFrameworkCore;
using Infrastructure.Persistence;
using Modules.Uniforms.Domain.Entities;
using SharedKernel;
using SharedKernel.Application;

namespace Modules.Uniforms.Application.Commands.SubmitWorkOrder;

public class SubmitWorkOrderCommandHandler : ICommandHandler<SubmitWorkOrderCommand>
{
    private readonly AppDbContext _db;

    public SubmitWorkOrderCommandHandler(AppDbContext db)
    {
        _db = db;
    }

    public async Task<Result> Handle(SubmitWorkOrderCommand request, CancellationToken cancellationToken)
    {
        var wo = await _db.Set<WorkOrder>()
            .FirstOrDefaultAsync(w => w.Id == request.Id, cancellationToken);

        if (wo == null) return Result.Failure("Work order not found.");
        if (wo.Status != "draft") return Result.Failure("Only draft work orders can be submitted.");

        wo.Status = "submitted";
        await _db.SaveChangesAsync(cancellationToken);
        return Result.Success();
    }
}
