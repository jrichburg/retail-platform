using Microsoft.EntityFrameworkCore;
using Infrastructure.Persistence;
using Modules.Catalog.Application.Dtos;
using Modules.Catalog.Domain.Entities;
using SharedKernel;
using SharedKernel.Application;

namespace Modules.Catalog.Application.Queries.GetDepartments;

public class GetDepartmentsQueryHandler : IQueryHandler<GetDepartmentsQuery, List<DepartmentDto>>
{
    private readonly AppDbContext _db;

    public GetDepartmentsQueryHandler(AppDbContext db)
    {
        _db = db;
    }

    public async Task<Result<List<DepartmentDto>>> Handle(GetDepartmentsQuery request, CancellationToken cancellationToken)
    {
        var departments = await _db.Set<Department>()
            .AsNoTracking()
            .Include(d => d.Categories.OrderBy(c => c.SortOrder))
            .OrderBy(d => d.SortOrder)
            .Select(d => new DepartmentDto
            {
                Id = d.Id,
                Name = d.Name,
                SortOrder = d.SortOrder,
                IsActive = d.IsActive,
                Categories = d.Categories.Select(c => new CategoryDto
                {
                    Id = c.Id,
                    Name = c.Name,
                    SortOrder = c.SortOrder,
                    IsActive = c.IsActive,
                }).ToList(),
            })
            .ToListAsync(cancellationToken);

        return Result.Success(departments);
    }
}
