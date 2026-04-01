using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Modules.Uniforms.Domain.Entities;

namespace Modules.Uniforms.Persistence;

public class WorkOrderLineConfiguration : IEntityTypeConfiguration<WorkOrderLine>
{
    public void Configure(EntityTypeBuilder<WorkOrderLine> builder)
    {
        builder.ToTable("work_order_lines");
        builder.HasKey(x => x.Id);
        builder.Property(x => x.Id).HasColumnName("id");
        builder.Property(x => x.WorkOrderId).HasColumnName("work_order_id").IsRequired();
        builder.Property(x => x.Description).HasColumnName("description").IsRequired().HasMaxLength(500);
        builder.Property(x => x.ProductVariantId).HasColumnName("product_variant_id");
        builder.Property(x => x.ProductName).HasColumnName("product_name").HasMaxLength(200);
        builder.Property(x => x.Sku).HasColumnName("sku").HasMaxLength(50);
        builder.Property(x => x.Quantity).HasColumnName("quantity").IsRequired();
        builder.Property(x => x.UnitPrice).HasColumnName("unit_price").HasColumnType("decimal(10,2)");
        builder.Property(x => x.CreatedAt).HasColumnName("created_at");
        builder.Property(x => x.UpdatedAt).HasColumnName("updated_at");

        builder.HasOne(x => x.WorkOrder).WithMany(x => x.Lines).HasForeignKey(x => x.WorkOrderId).OnDelete(DeleteBehavior.Cascade);
        builder.HasIndex(x => x.WorkOrderId).HasDatabaseName("ix_work_order_lines_order");
    }
}
