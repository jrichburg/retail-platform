using Microsoft.EntityFrameworkCore;
using Infrastructure.Persistence;
using Modules.Catalog.Application.Dtos;
using Modules.Catalog.Domain.Entities;
using SharedKernel;
using SharedKernel.Application;

namespace Modules.Catalog.Application.Queries.GetSuppliers;

public class GetSuppliersQueryHandler : IQueryHandler<GetSuppliersQuery, List<SupplierDto>>
{
    private readonly AppDbContext _db;

    public GetSuppliersQueryHandler(AppDbContext db)
    {
        _db = db;
    }

    public async Task<Result<List<SupplierDto>>> Handle(GetSuppliersQuery request, CancellationToken cancellationToken)
    {
        var suppliers = await _db.Set<Supplier>()
            .AsNoTracking()
            .OrderBy(s => s.Name)
            .Select(s => new SupplierDto
            {
                Id = s.Id,
                Name = s.Name,
                Code = s.Code,
                IsActive = s.IsActive,
            })
            .ToListAsync(cancellationToken);

        return Result.Success(suppliers);
    }
}
