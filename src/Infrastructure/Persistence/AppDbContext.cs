using Microsoft.EntityFrameworkCore;
using SharedKernel.Application;
using SharedKernel.Domain;

namespace Infrastructure.Persistence;

public class AppDbContext : DbContext
{
    private readonly ITenantContext? _tenantContext;
    private readonly ICurrentUser? _currentUser;

    public AppDbContext(
        DbContextOptions<AppDbContext> options,
        ITenantContext? tenantContext = null,
        ICurrentUser? currentUser = null)
        : base(options)
    {
        _tenantContext = tenantContext;
        _currentUser = currentUser;
    }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // Apply configurations from all module assemblies
        var assemblies = AppDomain.CurrentDomain.GetAssemblies()
            .Where(a => a.GetName().Name?.StartsWith("Modules.") == true)
            .ToArray();

        foreach (var assembly in assemblies)
            modelBuilder.ApplyConfigurationsFromAssembly(assembly);

        // Also apply configurations from Infrastructure assembly
        modelBuilder.ApplyConfigurationsFromAssembly(typeof(AppDbContext).Assembly);

        // Global tenant query filter for all TenantScopedEntity types
        foreach (var entityType in modelBuilder.Model.GetEntityTypes())
        {
            if (typeof(TenantScopedEntity).IsAssignableFrom(entityType.ClrType))
            {
                var method = typeof(AppDbContext)
                    .GetMethod(nameof(ApplyTenantFilter), System.Reflection.BindingFlags.NonPublic | System.Reflection.BindingFlags.Instance)!
                    .MakeGenericMethod(entityType.ClrType);
                method.Invoke(this, new object[] { modelBuilder });
            }
        }
    }

    private void ApplyTenantFilter<T>(ModelBuilder modelBuilder) where T : TenantScopedEntity
    {
        modelBuilder.Entity<T>().HasQueryFilter(e =>
            _tenantContext == null || e.RootTenantId == _tenantContext.RootTenantId);
    }

    public override async Task<int> SaveChangesAsync(CancellationToken cancellationToken = default)
    {
        var now = DateTime.UtcNow;

        foreach (var entry in ChangeTracker.Entries<BaseEntity>())
        {
            if (entry.State == EntityState.Added)
            {
                entry.Entity.CreatedAt = now;
                entry.Entity.UpdatedAt = now;
            }
            else if (entry.State == EntityState.Modified)
            {
                entry.Entity.UpdatedAt = now;
            }
        }

        if (_currentUser != null)
        {
            foreach (var entry in ChangeTracker.Entries<IAuditableEntity>())
            {
                if (entry.State == EntityState.Added)
                {
                    entry.Entity.CreatedBy = _currentUser.UserId;
                }
                else if (entry.State == EntityState.Modified)
                {
                    entry.Entity.UpdatedBy = _currentUser.UserId;
                }
            }
        }

        return await base.SaveChangesAsync(cancellationToken);
    }
}
