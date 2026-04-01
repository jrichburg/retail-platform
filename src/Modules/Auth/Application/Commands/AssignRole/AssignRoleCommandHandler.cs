using Microsoft.EntityFrameworkCore;
using Infrastructure.Persistence;
using Modules.Auth.Domain.Entities;
using SharedKernel;
using SharedKernel.Application;

namespace Modules.Auth.Application.Commands.AssignRole;

public class AssignRoleCommandHandler : ICommandHandler<AssignRoleCommand>
{
    private readonly AppDbContext _db;

    public AssignRoleCommandHandler(AppDbContext db)
    {
        _db = db;
    }

    public async Task<Result> Handle(AssignRoleCommand request, CancellationToken cancellationToken)
    {
        var user = await _db.Set<AppUser>()
            .Include(u => u.UserRoles)
            .FirstOrDefaultAsync(u => u.Id == request.UserId, cancellationToken);

        if (user == null) return Result.Failure("User not found.");

        var role = await _db.Set<Role>()
            .FirstOrDefaultAsync(r => r.Id == request.RoleId, cancellationToken);
        if (role == null) return Result.Failure("Role not found.");

        _db.Set<AppUserRole>().RemoveRange(user.UserRoles);

        _db.Set<AppUserRole>().Add(new AppUserRole
        {
            AppUserId = user.Id,
            RoleId = request.RoleId,
            TenantNodeId = user.TenantNodeId,
        });

        await _db.SaveChangesAsync(cancellationToken);
        return Result.Success();
    }
}
