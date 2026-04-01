using Microsoft.EntityFrameworkCore;
using Infrastructure.Persistence;
using Modules.Auth.Domain.Entities;
using SharedKernel;
using SharedKernel.Application;

namespace Modules.Auth.Application.Commands.CreateUser;

public class CreateUserCommandHandler : ICommandHandler<CreateUserCommand, Guid>
{
    private readonly AppDbContext _db;
    private readonly ITenantContext _tenantContext;

    public CreateUserCommandHandler(AppDbContext db, ITenantContext tenantContext)
    {
        _db = db;
        _tenantContext = tenantContext;
    }

    public async Task<Result<Guid>> Handle(CreateUserCommand request, CancellationToken cancellationToken)
    {
        var existingUser = await _db.Set<AppUser>()
            .AnyAsync(u => u.Email == request.Email && u.TenantNodeId == _tenantContext.TenantNodeId, cancellationToken);
        if (existingUser) return Result.Failure<Guid>("A user with this email already exists.");

        var role = await _db.Set<Role>()
            .FirstOrDefaultAsync(r => r.Id == request.RoleId, cancellationToken);
        if (role == null) return Result.Failure<Guid>("Role not found.");

        var user = new AppUser
        {
            SupabaseUserId = Guid.NewGuid(),
            Email = request.Email,
            FirstName = request.FirstName,
            LastName = request.LastName,
            IsActive = true,
            TenantNodeId = _tenantContext.TenantNodeId,
            RootTenantId = _tenantContext.RootTenantId,
        };

        _db.Set<AppUser>().Add(user);
        _db.Set<AppUserRole>().Add(new AppUserRole
        {
            AppUserId = user.Id,
            RoleId = request.RoleId,
            TenantNodeId = _tenantContext.TenantNodeId,
        });

        await _db.SaveChangesAsync(cancellationToken);
        return Result.Success(user.Id);
    }
}
