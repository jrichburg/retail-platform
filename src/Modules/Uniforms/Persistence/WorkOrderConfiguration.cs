using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Modules.Uniforms.Domain.Entities;

namespace Modules.Uniforms.Persistence;

public class WorkOrderConfiguration : IEntityTypeConfiguration<WorkOrder>
{
    public void Configure(EntityTypeBuilder<WorkOrder> builder)
    {
        builder.ToTable("work_orders");
        builder.HasKey(x => x.Id);
        builder.Property(x => x.Id).HasColumnName("id");
        builder.Property(x => x.TenantNodeId).HasColumnName("tenant_node_id").IsRequired();
        builder.Property(x => x.RootTenantId).HasColumnName("root_tenant_id").IsRequired();
        builder.Property(x => x.OrderNumber).HasColumnName("order_number").IsRequired().HasMaxLength(50);
        builder.Property(x => x.CustomerId).HasColumnName("customer_id").IsRequired();
        builder.Property(x => x.CustomerName).HasColumnName("customer_name").IsRequired().HasMaxLength(200);
        builder.Property(x => x.CustomerPhone).HasColumnName("customer_phone").HasMaxLength(50);
        builder.Property(x => x.CustomerEmail).HasColumnName("customer_email").HasMaxLength(200);
        builder.Property(x => x.Status).HasColumnName("status").IsRequired().HasMaxLength(30);
        builder.Property(x => x.DueDate).HasColumnName("due_date");
        builder.Property(x => x.Notes).HasColumnName("notes").HasMaxLength(500);
        builder.Property(x => x.TotalAmount).HasColumnName("total_amount").HasColumnType("decimal(10,2)");
        builder.Property(x => x.CreatedBy).HasColumnName("created_by");
        builder.Property(x => x.UpdatedBy).HasColumnName("updated_by");
        builder.Property(x => x.CreatedAt).HasColumnName("created_at");
        builder.Property(x => x.UpdatedAt).HasColumnName("updated_at");

        builder.HasIndex(x => x.OrderNumber).IsUnique().HasDatabaseName("ix_work_orders_number");
        builder.HasIndex(x => new { x.TenantNodeId, x.Status }).HasDatabaseName("ix_work_orders_tenant_status");
        builder.HasIndex(x => x.CustomerId).HasDatabaseName("ix_work_orders_customer");
    }
}
