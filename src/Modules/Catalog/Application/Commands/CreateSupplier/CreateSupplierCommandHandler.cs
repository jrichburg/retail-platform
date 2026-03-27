using Microsoft.EntityFrameworkCore;
using Infrastructure.Persistence;
using Modules.Catalog.Domain.Entities;
using SharedKernel;
using SharedKernel.Application;

namespace Modules.Catalog.Application.Commands.CreateSupplier;

public class CreateSupplierCommandHandler : ICommandHandler<CreateSupplierCommand, Guid>
{
    private readonly AppDbContext _db;
    private readonly ITenantContext _tenantContext;

    public CreateSupplierCommandHandler(AppDbContext db, ITenantContext tenantContext)
    {
        _db = db;
        _tenantContext = tenantContext;
    }

    public async Task<Result<Guid>> Handle(CreateSupplierCommand request, CancellationToken cancellationToken)
    {
        var nameExists = await _db.Set<Supplier>()
            .AnyAsync(s => s.Name == request.Name, cancellationToken);
        if (nameExists)
            return Result.Failure<Guid>($"A supplier named '{request.Name}' already exists.");

        var supplier = new Supplier
        {
            Name = request.Name,
            Code = request.Code,
            IsActive = true,
            TenantNodeId = _tenantContext.TenantNodeId,
            RootTenantId = _tenantContext.RootTenantId,
        };

        _db.Set<Supplier>().Add(supplier);
        await _db.SaveChangesAsync(cancellationToken);

        return Result.Success(supplier.Id);
    }
}
