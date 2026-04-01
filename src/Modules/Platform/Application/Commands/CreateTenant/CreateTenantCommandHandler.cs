using Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;
using Modules.Auth.Domain.Entities;
using Modules.Tenants.Domain.Entities;
using SharedKernel;
using SharedKernel.Application;

namespace Modules.Platform.Application.Commands.CreateTenant;

public class CreateTenantCommandHandler : ICommandHandler<CreateTenantCommand, Guid>
{
    private readonly AppDbContext _db;

    public CreateTenantCommandHandler(AppDbContext db)
    {
        _db = db;
    }

    public async Task<Result<Guid>> Handle(CreateTenantCommand request, CancellationToken cancellationToken)
    {
        var code = request.Code.Trim().ToUpperInvariant();
        var slug = code.ToLowerInvariant();

        var exists = await _db.Set<TenantNode>()
            .IgnoreQueryFilters()
            .AnyAsync(t => t.Code == code && t.NodeType == "root", cancellationToken);

        if (exists)
            return Result.Failure<Guid>($"A tenant with code '{code}' already exists.");

        // 1. Create root tenant node
        var rootId = Guid.NewGuid();
        var root = new TenantNode
        {
            Id = rootId,
            RootTenantId = rootId,
            ParentId = null,
            NodeType = "root",
            Name = request.Name.Trim(),
            Code = code,
            Path = slug,
            Depth = 0,
            IsActive = true,
            CreatedBy = Guid.Empty,
        };
        _db.Set<TenantNode>().Add(root);

        // 2. Create default store
        var storeCode = "MAIN";
        var store = new TenantNode
        {
            Id = Guid.NewGuid(),
            RootTenantId = rootId,
            ParentId = rootId,
            NodeType = "store",
            Name = "Main Store",
            Code = storeCode,
            Path = $"{slug}.main",
            Depth = 1,
            IsActive = true,
            CreatedBy = Guid.Empty,
        };
        _db.Set<TenantNode>().Add(store);

        // 3. Default tenant settings
        var settings = new[]
        {
            new TenantSetting
            {
                TenantNodeId = rootId,
                SettingsKey = "tax_rate",
                SettingsValue = "{\"rate\": 0.08, \"description\": \"Default 8% tax\"}",
                IsLocked = false,
            },
            new TenantSetting
            {
                TenantNodeId = rootId,
                SettingsKey = "currency",
                SettingsValue = "{\"code\": \"USD\", \"symbol\": \"$\"}",
                IsLocked = true,
            },
            new TenantSetting
            {
                TenantNodeId = rootId,
                SettingsKey = "receipt_footer",
                SettingsValue = "{\"text\": \"Thank you for your business!\"}",
                IsLocked = false,
            },
        };
        _db.Set<TenantSetting>().AddRange(settings);

        // 4. Create initial owner user (SupabaseUserId = Empty until they log in and sync)
        var ownerRole = await _db.Set<Role>()
            .AsNoTracking()
            .FirstOrDefaultAsync(r => r.Name == "owner", cancellationToken);

        if (ownerRole == null)
            return Result.Failure<Guid>("Owner role not found. Ensure AuthSeeder has run.");

        var adminUser = new AppUser
        {
            TenantNodeId = store.Id,
            RootTenantId = rootId,
            SupabaseUserId = Guid.Empty,
            Email = request.AdminEmail.Trim().ToLowerInvariant(),
            FirstName = request.AdminFirstName.Trim(),
            LastName = request.AdminLastName.Trim(),
            IsActive = true,
            CreatedBy = Guid.Empty,
        };
        _db.Set<AppUser>().Add(adminUser);

        // Save user first to get the ID
        await _db.SaveChangesAsync(cancellationToken);

        // 5. Assign owner role at the root tenant node level
        var userRole = new AppUserRole
        {
            AppUserId = adminUser.Id,
            RoleId = ownerRole.Id,
            TenantNodeId = rootId,
        };
        _db.Set<AppUserRole>().Add(userRole);

        await _db.SaveChangesAsync(cancellationToken);

        return Result.Success(rootId);
    }
}
