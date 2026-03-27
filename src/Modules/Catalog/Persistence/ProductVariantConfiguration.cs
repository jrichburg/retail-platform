using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Modules.Catalog.Domain.Entities;

namespace Modules.Catalog.Persistence;

public class ProductVariantConfiguration : IEntityTypeConfiguration<ProductVariant>
{
    public void Configure(EntityTypeBuilder<ProductVariant> builder)
    {
        builder.ToTable("product_variants");

        builder.HasKey(x => x.Id);
        builder.Property(x => x.Id).HasColumnName("id");
        builder.Property(x => x.TenantNodeId).HasColumnName("tenant_node_id").IsRequired();
        builder.Property(x => x.RootTenantId).HasColumnName("root_tenant_id").IsRequired();
        builder.Property(x => x.ProductId).HasColumnName("product_id").IsRequired();
        builder.Property(x => x.Dimension1Value).HasColumnName("dimension1_value").HasMaxLength(20);
        builder.Property(x => x.Dimension2Value).HasColumnName("dimension2_value").HasMaxLength(20);
        builder.Property(x => x.Upc).HasColumnName("upc").HasMaxLength(50);
        builder.Property(x => x.IsActive).HasColumnName("is_active").HasDefaultValue(true);
        builder.Property(x => x.CreatedAt).HasColumnName("created_at");
        builder.Property(x => x.UpdatedAt).HasColumnName("updated_at");

        builder.HasOne(x => x.Product).WithMany(x => x.Variants).HasForeignKey(x => x.ProductId).OnDelete(DeleteBehavior.Cascade);

        builder.HasIndex(x => new { x.ProductId, x.Dimension1Value, x.Dimension2Value }).IsUnique().HasDatabaseName("ix_product_variants_product_dims");
        builder.HasIndex(x => x.Upc).HasDatabaseName("ix_product_variants_upc");
        builder.HasIndex(x => new { x.RootTenantId, x.Upc }).IsUnique().HasDatabaseName("ix_product_variants_tenant_upc").HasFilter("upc IS NOT NULL");
    }
}
