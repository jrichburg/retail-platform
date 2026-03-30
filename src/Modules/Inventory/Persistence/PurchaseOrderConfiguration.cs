using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Modules.Inventory.Domain.Entities;

namespace Modules.Inventory.Persistence;

public class PurchaseOrderConfiguration : IEntityTypeConfiguration<PurchaseOrder>
{
    public void Configure(EntityTypeBuilder<PurchaseOrder> builder)
    {
        builder.ToTable("purchase_orders");
        builder.HasKey(x => x.Id);
        builder.Property(x => x.Id).HasColumnName("id");
        builder.Property(x => x.TenantNodeId).HasColumnName("tenant_node_id").IsRequired();
        builder.Property(x => x.RootTenantId).HasColumnName("root_tenant_id").IsRequired();
        builder.Property(x => x.OrderNumber).HasColumnName("order_number").IsRequired().HasMaxLength(50);
        builder.Property(x => x.SupplierId).HasColumnName("supplier_id").IsRequired();
        builder.Property(x => x.SupplierName).HasColumnName("supplier_name").IsRequired().HasMaxLength(200);
        builder.Property(x => x.Status).HasColumnName("status").IsRequired().HasMaxLength(30);
        builder.Property(x => x.Notes).HasColumnName("notes").HasMaxLength(500);
        builder.Property(x => x.ExpectedDate).HasColumnName("expected_date");
        builder.Property(x => x.TotalCost).HasColumnName("total_cost").HasColumnType("decimal(10,2)");
        builder.Property(x => x.CreatedBy).HasColumnName("created_by");
        builder.Property(x => x.UpdatedBy).HasColumnName("updated_by");
        builder.Property(x => x.CreatedAt).HasColumnName("created_at");
        builder.Property(x => x.UpdatedAt).HasColumnName("updated_at");

        builder.HasIndex(x => x.OrderNumber).IsUnique().HasDatabaseName("ix_purchase_orders_number");
        builder.HasIndex(x => new { x.TenantNodeId, x.Status }).HasDatabaseName("ix_purchase_orders_tenant_status");
        builder.HasIndex(x => x.SupplierId).HasDatabaseName("ix_purchase_orders_supplier");
    }
}
