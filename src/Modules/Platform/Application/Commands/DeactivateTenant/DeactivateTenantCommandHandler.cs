using Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;
using Modules.Tenants.Domain.Entities;
using SharedKernel;
using SharedKernel.Application;

namespace Modules.Platform.Application.Commands.DeactivateTenant;

public class DeactivateTenantCommandHandler : ICommandHandler<DeactivateTenantCommand>
{
    private readonly AppDbContext _db;

    public DeactivateTenantCommandHandler(AppDbContext db)
    {
        _db = db;
    }

    public async Task<Result> Handle(DeactivateTenantCommand request, CancellationToken cancellationToken)
    {
        var nodes = await _db.Set<TenantNode>()
            .IgnoreQueryFilters()
            .Where(t => t.RootTenantId == request.TenantId)
            .ToListAsync(cancellationToken);

        if (!nodes.Any())
            return Result.Failure("Tenant not found.");

        foreach (var node in nodes)
            node.IsActive = false;

        await _db.SaveChangesAsync(cancellationToken);
        return Result.Success();
    }
}
