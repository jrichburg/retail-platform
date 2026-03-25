using Microsoft.EntityFrameworkCore;
using Infrastructure.Persistence;
using Modules.Auth.Application.Dtos;
using Modules.Auth.Domain.Entities;
using SharedKernel;
using SharedKernel.Application;

namespace Modules.Auth.Application.Queries.GetCurrentUser;

public class GetCurrentUserQueryHandler : IQueryHandler<GetCurrentUserQuery, AuthUserDto>
{
    private readonly AppDbContext _db;

    public GetCurrentUserQueryHandler(AppDbContext db)
    {
        _db = db;
    }

    public async Task<Result<AuthUserDto>> Handle(GetCurrentUserQuery request, CancellationToken cancellationToken)
    {
        var user = await _db.Set<AppUser>()
            .AsNoTracking()
            .Include(u => u.UserRoles)
                .ThenInclude(ur => ur.Role)
                    .ThenInclude(r => r.RolePermissions)
                        .ThenInclude(rp => rp.Permission)
            .FirstOrDefaultAsync(u => u.SupabaseUserId == request.SupabaseUserId, cancellationToken);

        if (user == null)
            return Result.Failure<AuthUserDto>("User not found. Call POST /api/v1/auth/sync first.");

        var dto = new AuthUserDto
        {
            Id = user.Id,
            Email = user.Email,
            FirstName = user.FirstName,
            LastName = user.LastName,
            TenantNodeId = user.TenantNodeId,
            RootTenantId = user.RootTenantId,
            Roles = user.UserRoles.Select(ur => ur.Role.Name).Distinct().ToList(),
            Permissions = user.UserRoles
                .SelectMany(ur => ur.Role.RolePermissions)
                .Select(rp => rp.Permission.Name)
                .Distinct()
                .ToList(),
        };

        return Result.Success(dto);
    }
}
