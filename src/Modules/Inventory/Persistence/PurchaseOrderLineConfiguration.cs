using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Modules.Inventory.Domain.Entities;

namespace Modules.Inventory.Persistence;

public class PurchaseOrderLineConfiguration : IEntityTypeConfiguration<PurchaseOrderLine>
{
    public void Configure(EntityTypeBuilder<PurchaseOrderLine> builder)
    {
        builder.ToTable("purchase_order_lines");
        builder.HasKey(x => x.Id);
        builder.Property(x => x.Id).HasColumnName("id");
        builder.Property(x => x.PurchaseOrderId).HasColumnName("purchase_order_id").IsRequired();
        builder.Property(x => x.ProductId).HasColumnName("product_id").IsRequired();
        builder.Property(x => x.ProductVariantId).HasColumnName("product_variant_id");
        builder.Property(x => x.ProductName).HasColumnName("product_name").IsRequired().HasMaxLength(200);
        builder.Property(x => x.Sku).HasColumnName("sku").IsRequired().HasMaxLength(50);
        builder.Property(x => x.VariantDescription).HasColumnName("variant_description").HasMaxLength(100);
        builder.Property(x => x.QuantityOrdered).HasColumnName("quantity_ordered").IsRequired();
        builder.Property(x => x.QuantityReceived).HasColumnName("quantity_received");
        builder.Property(x => x.UnitCost).HasColumnName("unit_cost").HasColumnType("decimal(10,2)");
        builder.Property(x => x.CreatedAt).HasColumnName("created_at");
        builder.Property(x => x.UpdatedAt).HasColumnName("updated_at");

        builder.HasOne(x => x.PurchaseOrder).WithMany(x => x.Lines).HasForeignKey(x => x.PurchaseOrderId).OnDelete(DeleteBehavior.Cascade);
        builder.HasIndex(x => x.PurchaseOrderId).HasDatabaseName("ix_purchase_order_lines_order");
    }
}
