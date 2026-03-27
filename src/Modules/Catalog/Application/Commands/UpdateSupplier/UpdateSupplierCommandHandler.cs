using Microsoft.EntityFrameworkCore;
using Infrastructure.Persistence;
using Modules.Catalog.Domain.Entities;
using SharedKernel;
using SharedKernel.Application;

namespace Modules.Catalog.Application.Commands.UpdateSupplier;

public class UpdateSupplierCommandHandler : ICommandHandler<UpdateSupplierCommand>
{
    private readonly AppDbContext _db;

    public UpdateSupplierCommandHandler(AppDbContext db)
    {
        _db = db;
    }

    public async Task<Result> Handle(UpdateSupplierCommand request, CancellationToken cancellationToken)
    {
        var supplier = await _db.Set<Supplier>()
            .FirstOrDefaultAsync(s => s.Id == request.Id, cancellationToken);
        if (supplier == null)
            return Result.Failure("Supplier not found.");

        if (supplier.Name != request.Name)
        {
            var nameExists = await _db.Set<Supplier>()
                .AnyAsync(s => s.Name == request.Name && s.Id != request.Id, cancellationToken);
            if (nameExists)
                return Result.Failure($"A supplier named '{request.Name}' already exists.");
        }

        supplier.Name = request.Name;
        supplier.Code = request.Code;
        supplier.IsActive = request.IsActive;
        await _db.SaveChangesAsync(cancellationToken);

        return Result.Success();
    }
}
