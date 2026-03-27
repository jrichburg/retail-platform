using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Modules.Inventory.Domain.Entities;

namespace Modules.Inventory.Persistence;

public class StockLevelConfiguration : IEntityTypeConfiguration<StockLevel>
{
    public void Configure(EntityTypeBuilder<StockLevel> builder)
    {
        builder.ToTable("stock_levels");
        builder.HasKey(x => x.Id);
        builder.Property(x => x.Id).HasColumnName("id");
        builder.Property(x => x.TenantNodeId).HasColumnName("tenant_node_id").IsRequired();
        builder.Property(x => x.RootTenantId).HasColumnName("root_tenant_id").IsRequired();
        builder.Property(x => x.ProductId).HasColumnName("product_id").IsRequired();
        builder.Property(x => x.ProductVariantId).HasColumnName("product_variant_id");
        builder.Property(x => x.QuantityOnHand).HasColumnName("quantity_on_hand");
        builder.Property(x => x.QuantityReserved).HasColumnName("quantity_reserved");
        builder.Property(x => x.ReorderPoint).HasColumnName("reorder_point");
        builder.Property(x => x.CreatedAt).HasColumnName("created_at");
        builder.Property(x => x.UpdatedAt).HasColumnName("updated_at");

        builder.HasIndex(x => new { x.TenantNodeId, x.ProductId }).IsUnique().HasDatabaseName("ix_stock_levels_tenant_product");
    }
}
