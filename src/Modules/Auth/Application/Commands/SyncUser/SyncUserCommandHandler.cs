using Microsoft.EntityFrameworkCore;
using Infrastructure.Persistence;
using Modules.Auth.Application.Dtos;
using Modules.Auth.Domain.Entities;
using SharedKernel;
using SharedKernel.Application;

namespace Modules.Auth.Application.Commands.SyncUser;

public class SyncUserCommandHandler : ICommandHandler<SyncUserCommand, AuthUserDto>
{
    private readonly AppDbContext _db;

    public SyncUserCommandHandler(AppDbContext db)
    {
        _db = db;
    }

    public async Task<Result<AuthUserDto>> Handle(SyncUserCommand request, CancellationToken cancellationToken)
    {
        var existingUser = await _db.Set<AppUser>()
            .Include(u => u.UserRoles)
                .ThenInclude(ur => ur.Role)
                    .ThenInclude(r => r.RolePermissions)
                        .ThenInclude(rp => rp.Permission)
            .FirstOrDefaultAsync(u => u.SupabaseUserId == request.SupabaseUserId, cancellationToken);

        if (existingUser != null)
        {
            // Update existing user
            existingUser.Email = request.Email;
            if (request.FirstName != null) existingUser.FirstName = request.FirstName;
            if (request.LastName != null) existingUser.LastName = request.LastName;
            await _db.SaveChangesAsync(cancellationToken);

            return Result.Success(MapToDto(existingUser));
        }

        // Create new user
        var newUser = new AppUser
        {
            SupabaseUserId = request.SupabaseUserId,
            Email = request.Email,
            FirstName = request.FirstName ?? string.Empty,
            LastName = request.LastName ?? string.Empty,
            TenantNodeId = request.TenantNodeId,
            RootTenantId = request.RootTenantId,
            IsActive = true,
            CreatedBy = Guid.Empty,
        };

        _db.Set<AppUser>().Add(newUser);

        // Assign default "cashier" role
        var cashierRole = await _db.Set<Role>()
            .Include(r => r.RolePermissions)
                .ThenInclude(rp => rp.Permission)
            .FirstOrDefaultAsync(r => r.Name == "cashier", cancellationToken);

        if (cashierRole != null)
        {
            var userRole = new AppUserRole
            {
                AppUserId = newUser.Id,
                RoleId = cashierRole.Id,
                TenantNodeId = request.TenantNodeId,
            };
            _db.Set<AppUserRole>().Add(userRole);
            newUser.UserRoles.Add(userRole);
            userRole.Role = cashierRole;
        }

        await _db.SaveChangesAsync(cancellationToken);

        return Result.Success(MapToDto(newUser));
    }

    private static AuthUserDto MapToDto(AppUser user) => new()
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
}
