using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Modules.Auth.Domain.Entities;

namespace Modules.Auth.Persistence;

public class AppUserConfiguration : IEntityTypeConfiguration<AppUser>
{
    public void Configure(EntityTypeBuilder<AppUser> builder)
    {
        builder.ToTable("app_users");

        builder.HasKey(x => x.Id);
        builder.Property(x => x.Id).HasColumnName("id");
        builder.Property(x => x.SupabaseUserId).HasColumnName("supabase_user_id").IsRequired();
        builder.Property(x => x.Email).HasColumnName("email").IsRequired().HasMaxLength(255);
        builder.Property(x => x.FirstName).HasColumnName("first_name").HasMaxLength(100);
        builder.Property(x => x.LastName).HasColumnName("last_name").HasMaxLength(100);
        builder.Property(x => x.IsActive).HasColumnName("is_active").HasDefaultValue(true);
        builder.Property(x => x.TenantNodeId).HasColumnName("tenant_node_id").IsRequired();
        builder.Property(x => x.RootTenantId).HasColumnName("root_tenant_id").IsRequired();
        builder.Property(x => x.CreatedAt).HasColumnName("created_at");
        builder.Property(x => x.UpdatedAt).HasColumnName("updated_at");
        builder.Property(x => x.CreatedBy).HasColumnName("created_by");
        builder.Property(x => x.UpdatedBy).HasColumnName("updated_by");

        builder.HasIndex(x => new { x.SupabaseUserId, x.TenantNodeId })
            .IsUnique()
            .HasDatabaseName("ix_app_users_supabase_tenant");

        builder.HasIndex(x => x.Email).HasDatabaseName("ix_app_users_email");
    }
}
