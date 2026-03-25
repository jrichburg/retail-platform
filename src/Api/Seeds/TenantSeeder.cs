using Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;
using Modules.Tenants.Domain.Entities;

namespace Api.Seeds;

public static class TenantSeeder
{
    public static async Task SeedAsync(AppDbContext db)
    {
        if (await db.Set<TenantNode>().AnyAsync())
            return;

        var rootId = Guid.NewGuid();

        var root = new TenantNode
        {
            Id = rootId,
            RootTenantId = rootId,
            ParentId = null,
            NodeType = "root",
            Name = "Demo Retailer",
            Code = "DEMO",
            Path = "demo",
            Depth = 0,
            IsActive = true,
            CreatedBy = Guid.Empty,
        };

        var store = new TenantNode
        {
            Id = Guid.NewGuid(),
            RootTenantId = rootId,
            ParentId = rootId,
            NodeType = "store",
            Name = "Main Street Store",
            Code = "MAIN",
            Path = "demo.main",
            Depth = 1,
            IsActive = true,
            CreatedBy = Guid.Empty,
        };

        db.Set<TenantNode>().AddRange(root, store);

        var defaultSettings = new[]
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

        db.Set<TenantSetting>().AddRange(defaultSettings);
        await db.SaveChangesAsync();
    }
}
