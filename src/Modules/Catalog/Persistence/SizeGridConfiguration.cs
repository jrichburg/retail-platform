using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Modules.Catalog.Domain.Entities;

namespace Modules.Catalog.Persistence;

public class SizeGridConfiguration : IEntityTypeConfiguration<SizeGrid>
{
    public void Configure(EntityTypeBuilder<SizeGrid> builder)
    {
        builder.ToTable("size_grids");

        builder.HasKey(x => x.Id);
        builder.Property(x => x.Id).HasColumnName("id");
        builder.Property(x => x.TenantNodeId).HasColumnName("tenant_node_id").IsRequired();
        builder.Property(x => x.RootTenantId).HasColumnName("root_tenant_id").IsRequired();
        builder.Property(x => x.Name).HasColumnName("name").IsRequired().HasMaxLength(200);
        builder.Property(x => x.Dimension1Label).HasColumnName("dimension1_label").IsRequired().HasMaxLength(50);
        builder.Property(x => x.Dimension2Label).HasColumnName("dimension2_label").HasMaxLength(50);
        builder.Property(x => x.IsActive).HasColumnName("is_active").HasDefaultValue(true);
        builder.Property(x => x.CreatedAt).HasColumnName("created_at");
        builder.Property(x => x.UpdatedAt).HasColumnName("updated_at");
        builder.Property(x => x.CreatedBy).HasColumnName("created_by");
        builder.Property(x => x.UpdatedBy).HasColumnName("updated_by");

        builder.HasIndex(x => new { x.RootTenantId, x.Name }).IsUnique().HasDatabaseName("ix_size_grids_tenant_name");
    }
}
