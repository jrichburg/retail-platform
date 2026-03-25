using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Modules.Tenants.Domain.Entities;

namespace Modules.Tenants.Persistence;

public class TenantSettingConfiguration : IEntityTypeConfiguration<TenantSetting>
{
    public void Configure(EntityTypeBuilder<TenantSetting> builder)
    {
        builder.ToTable("tenant_settings");

        builder.HasKey(x => x.Id);
        builder.Property(x => x.Id).HasColumnName("id");
        builder.Property(x => x.TenantNodeId).HasColumnName("tenant_node_id").IsRequired();
        builder.Property(x => x.SettingsKey).HasColumnName("settings_key").IsRequired().HasMaxLength(100);
        builder.Property(x => x.SettingsValue).HasColumnName("settings_value").IsRequired().HasColumnType("jsonb");
        builder.Property(x => x.IsLocked).HasColumnName("is_locked").HasDefaultValue(false);
        builder.Property(x => x.CreatedAt).HasColumnName("created_at");
        builder.Property(x => x.UpdatedAt).HasColumnName("updated_at");

        builder.HasOne(x => x.TenantNode)
            .WithMany(x => x.Settings)
            .HasForeignKey(x => x.TenantNodeId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasIndex(x => new { x.TenantNodeId, x.SettingsKey })
            .IsUnique()
            .HasDatabaseName("ix_tenant_settings_node_key");
    }
}
