using Microsoft.EntityFrameworkCore;
using Infrastructure.Persistence;
using Modules.Tenants.Domain.Entities;
using SharedKernel;
using SharedKernel.Application;

namespace Modules.Tenants.Application.Commands.UpdateStore;

public class UpdateStoreCommandHandler : ICommandHandler<UpdateStoreCommand>
{
    private readonly AppDbContext _db;

    public UpdateStoreCommandHandler(AppDbContext db)
    {
        _db = db;
    }

    public async Task<Result> Handle(UpdateStoreCommand request, CancellationToken cancellationToken)
    {
        var store = await _db.Set<TenantNode>()
            .FirstOrDefaultAsync(n => n.Id == request.Id && n.NodeType == "store", cancellationToken);

        if (store == null)
            return Result.Failure("Store not found.");

        store.Name = request.Name;
        if (request.Code != null) store.Code = request.Code;
        store.IsActive = request.IsActive;

        await _db.SaveChangesAsync(cancellationToken);
        return Result.Success();
    }
}
