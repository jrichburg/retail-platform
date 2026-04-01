using Microsoft.EntityFrameworkCore;
using Infrastructure.Persistence;
using Modules.Auth.Application.Dtos;
using Modules.Auth.Domain.Entities;
using SharedKernel;
using SharedKernel.Application;

namespace Modules.Auth.Application.Queries.GetRoles;

public class GetRolesQueryHandler : IQueryHandler<GetRolesQuery, List<RoleDto>>
{
    private readonly AppDbContext _db;

    public GetRolesQueryHandler(AppDbContext db)
    {
        _db = db;
    }

    public async Task<Result<List<RoleDto>>> Handle(GetRolesQuery request, CancellationToken cancellationToken)
    {
        var roles = await _db.Set<Role>()
            .AsNoTracking()
            .OrderBy(r => r.Name)
            .Select(r => new RoleDto
            {
                Id = r.Id,
                Name = r.Name,
                Description = r.Description,
            })
            .ToListAsync(cancellationToken);

        return Result.Success(roles);
    }
}
