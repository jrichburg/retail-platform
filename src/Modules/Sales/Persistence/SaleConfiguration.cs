using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Modules.Sales.Domain.Entities;

namespace Modules.Sales.Persistence;

public class SaleConfiguration : IEntityTypeConfiguration<Sale>
{
    public void Configure(EntityTypeBuilder<Sale> builder)
    {
        builder.ToTable("sales");
        builder.HasKey(x => x.Id);
        builder.Property(x => x.Id).HasColumnName("id");
        builder.Property(x => x.TenantNodeId).HasColumnName("tenant_node_id").IsRequired();
        builder.Property(x => x.RootTenantId).HasColumnName("root_tenant_id").IsRequired();
        builder.Property(x => x.TransactionNumber).HasColumnName("transaction_number").IsRequired().HasMaxLength(50);
        builder.Property(x => x.TransactionDate).HasColumnName("transaction_date").IsRequired();
        builder.Property(x => x.Status).HasColumnName("status").IsRequired().HasMaxLength(20);
        builder.Property(x => x.Subtotal).HasColumnName("subtotal").HasColumnType("decimal(10,2)");
        builder.Property(x => x.TaxRate).HasColumnName("tax_rate").HasColumnType("decimal(5,4)");
        builder.Property(x => x.TaxAmount).HasColumnName("tax_amount").HasColumnType("decimal(10,2)");
        builder.Property(x => x.TotalAmount).HasColumnName("total_amount").HasColumnType("decimal(10,2)");
        builder.Property(x => x.TenderedAmount).HasColumnName("tendered_amount").HasColumnType("decimal(10,2)");
        builder.Property(x => x.ChangeAmount).HasColumnName("change_amount").HasColumnType("decimal(10,2)");
        builder.Property(x => x.CustomerId).HasColumnName("customer_id");
        builder.Property(x => x.CustomerName).HasColumnName("customer_name").HasMaxLength(200);
        builder.Property(x => x.CashierId).HasColumnName("cashier_id");
        builder.Property(x => x.CreatedAt).HasColumnName("created_at");
        builder.Property(x => x.UpdatedAt).HasColumnName("updated_at");
        builder.Property(x => x.CreatedBy).HasColumnName("created_by");
        builder.Property(x => x.UpdatedBy).HasColumnName("updated_by");

        builder.HasIndex(x => x.TransactionNumber).IsUnique().HasDatabaseName("ix_sales_transaction_number");
        builder.HasIndex(x => new { x.TenantNodeId, x.TransactionDate }).HasDatabaseName("ix_sales_tenant_date");
    }
}
