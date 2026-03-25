using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Modules.Tenants.Domain.Entities;

namespace Modules.Tenants.Persistence;

public class TenantNodeConfiguration : IEntityTypeConfiguration<TenantNode>
{
    public void Configure(EntityTypeBuilder<TenantNode> builder)
    {
        builder.ToTable("tenant_nodes");

        builder.HasKey(x => x.Id);
        builder.Property(x => x.Id).HasColumnName("id");
        builder.Property(x => x.RootTenantId).HasColumnName("root_tenant_id").IsRequired();
        builder.Property(x => x.ParentId).HasColumnName("parent_id");
        builder.Property(x => x.NodeType).HasColumnName("node_type").IsRequired().HasMaxLength(20);
        builder.Property(x => x.Name).HasColumnName("name").IsRequired().HasMaxLength(200);
        builder.Property(x => x.Code).HasColumnName("code").HasMaxLength(20);
        builder.Property(x => x.Path).HasColumnName("path").IsRequired().HasMaxLength(500);
        builder.Property(x => x.Depth).HasColumnName("depth").IsRequired();
        builder.Property(x => x.IsActive).HasColumnName("is_active").HasDefaultValue(true);
        builder.Property(x => x.CreatedAt).HasColumnName("created_at");
        builder.Property(x => x.UpdatedAt).HasColumnName("updated_at");
        builder.Property(x => x.CreatedBy).HasColumnName("created_by");
        builder.Property(x => x.UpdatedBy).HasColumnName("updated_by");

        builder.HasOne(x => x.Parent)
            .WithMany(x => x.Children)
            .HasForeignKey(x => x.ParentId)
            .OnDelete(DeleteBehavior.Restrict);

        builder.HasIndex(x => x.RootTenantId).HasDatabaseName("ix_tenant_nodes_root");
        builder.HasIndex(x => x.Path).HasDatabaseName("ix_tenant_nodes_path");
    }
}
