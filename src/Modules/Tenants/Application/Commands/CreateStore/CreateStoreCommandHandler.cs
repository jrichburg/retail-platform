using Microsoft.EntityFrameworkCore;
using Infrastructure.Persistence;
using Modules.Tenants.Domain.Entities;
using SharedKernel;
using SharedKernel.Application;

namespace Modules.Tenants.Application.Commands.CreateStore;

public class CreateStoreCommandHandler : ICommandHandler<CreateStoreCommand, Guid>
{
    private readonly AppDbContext _db;

    public CreateStoreCommandHandler(AppDbContext db)
    {
        _db = db;
    }

    public async Task<Result<Guid>> Handle(CreateStoreCommand request, CancellationToken cancellationToken)
    {
        var parent = await _db.Set<TenantNode>()
            .FirstOrDefaultAsync(n => n.Id == request.ParentId, cancellationToken);

        if (parent == null)
            return Result.Failure<Guid>("Parent node not found.");

        var store = new TenantNode
        {
            RootTenantId = parent.RootTenantId,
            ParentId = parent.Id,
            NodeType = "store",
            Name = request.Name,
            Code = request.Code,
            Path = $"{parent.Path}.{request.Code.ToLower()}",
            Depth = parent.Depth + 1,
            IsActive = true,
            CreatedBy = Guid.Empty,
        };

        _db.Set<TenantNode>().Add(store);
        await _db.SaveChangesAsync(cancellationToken);

        return Result.Success(store.Id);
    }
}
