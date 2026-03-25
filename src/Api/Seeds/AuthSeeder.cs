using Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;
using Modules.Auth.Domain.Entities;

namespace Api.Seeds;

public static class AuthSeeder
{
    public static async Task SeedAsync(AppDbContext db)
    {
        if (await db.Set<Role>().AnyAsync())
            return;

        // Permissions
        var permissions = new List<Permission>
        {
            new() { Name = "catalog:read", Module = "catalog" },
            new() { Name = "catalog:write", Module = "catalog" },
            new() { Name = "inventory:read", Module = "inventory" },
            new() { Name = "inventory:write", Module = "inventory" },
            new() { Name = "inventory:receive", Module = "inventory" },
            new() { Name = "inventory:adjust", Module = "inventory" },
            new() { Name = "sales:create", Module = "sales" },
            new() { Name = "sales:read", Module = "sales" },
            new() { Name = "sales:void", Module = "sales" },
            new() { Name = "customers:read", Module = "customers" },
            new() { Name = "customers:write", Module = "customers" },
            new() { Name = "tenants:read", Module = "tenants" },
            new() { Name = "tenants:write", Module = "tenants" },
            new() { Name = "settings:read", Module = "settings" },
            new() { Name = "settings:write", Module = "settings" },
            new() { Name = "reporting:read", Module = "reporting" },
            new() { Name = "users:read", Module = "auth" },
            new() { Name = "users:write", Module = "auth" },
        };

        db.Set<Permission>().AddRange(permissions);
        await db.SaveChangesAsync();

        // Roles
        var ownerRole = new Role { Name = "owner", Description = "Full access to all features" };
        var managerRole = new Role { Name = "manager", Description = "Store management access" };
        var cashierRole = new Role { Name = "cashier", Description = "POS and basic operations" };

        db.Set<Role>().AddRange(ownerRole, managerRole, cashierRole);
        await db.SaveChangesAsync();

        // Owner gets all permissions
        foreach (var perm in permissions)
        {
            db.Set<RolePermission>().Add(new RolePermission { RoleId = ownerRole.Id, PermissionId = perm.Id });
        }

        // Manager gets most permissions
        var managerPerms = permissions.Where(p =>
            p.Name != "tenants:write" && p.Name != "settings:write" && p.Name != "users:write");
        foreach (var perm in managerPerms)
        {
            db.Set<RolePermission>().Add(new RolePermission { RoleId = managerRole.Id, PermissionId = perm.Id });
        }

        // Cashier gets basic permissions
        var cashierPerms = permissions.Where(p =>
            p.Name is "catalog:read" or "inventory:read" or "sales:create" or "sales:read" or "customers:read");
        foreach (var perm in cashierPerms)
        {
            db.Set<RolePermission>().Add(new RolePermission { RoleId = cashierRole.Id, PermissionId = perm.Id });
        }

        await db.SaveChangesAsync();
    }
}
