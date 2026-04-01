using Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;
using Modules.Platform.Domain.Entities;

namespace Api.Seeds;

public static class PlatformSeeder
{
    // Demo platform admin — use a known Supabase user ID or Guid.Empty for dev
    private static readonly Guid DemoSupabaseUserId = Guid.Empty;

    public static async Task SeedAsync(AppDbContext db)
    {
        if (await db.Set<PlatformAdmin>().AnyAsync())
            return;

        var admin = new PlatformAdmin
        {
            SupabaseUserId = DemoSupabaseUserId,
            Email = "admin@retailplatform.com",
            Name = "Platform Admin",
            IsActive = true,
        };

        db.Set<PlatformAdmin>().Add(admin);
        await db.SaveChangesAsync();
    }
}
