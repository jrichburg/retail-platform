using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Modules.AccountsReceivable.Domain.Entities;

namespace Modules.AccountsReceivable.Persistence;

public class InvoiceConfiguration : IEntityTypeConfiguration<Invoice>
{
    public void Configure(EntityTypeBuilder<Invoice> builder)
    {
        builder.ToTable("ar_invoices");
        builder.HasKey(x => x.Id);
        builder.Property(x => x.Id).HasColumnName("id");
        builder.Property(x => x.TenantNodeId).HasColumnName("tenant_node_id").IsRequired();
        builder.Property(x => x.RootTenantId).HasColumnName("root_tenant_id").IsRequired();
        builder.Property(x => x.InvoiceNumber).HasColumnName("invoice_number").IsRequired().HasMaxLength(50);
        builder.Property(x => x.CustomerId).HasColumnName("customer_id").IsRequired();
        builder.Property(x => x.CustomerName).HasColumnName("customer_name").IsRequired().HasMaxLength(200);
        builder.Property(x => x.SourceType).HasColumnName("source_type").HasMaxLength(30);
        builder.Property(x => x.SourceId).HasColumnName("source_id");
        builder.Property(x => x.SourceReference).HasColumnName("source_reference").HasMaxLength(100);
        builder.Property(x => x.Status).HasColumnName("status").IsRequired().HasMaxLength(30);
        builder.Property(x => x.InvoiceDate).HasColumnName("invoice_date").IsRequired();
        builder.Property(x => x.DueDate).HasColumnName("due_date").IsRequired();
        builder.Property(x => x.Amount).HasColumnName("amount").HasColumnType("decimal(10,2)");
        builder.Property(x => x.AmountPaid).HasColumnName("amount_paid").HasColumnType("decimal(10,2)");
        builder.Property(x => x.BalanceDue).HasColumnName("balance_due").HasColumnType("decimal(10,2)");
        builder.Property(x => x.Notes).HasColumnName("notes").HasMaxLength(500);
        builder.Property(x => x.CreatedBy).HasColumnName("created_by");
        builder.Property(x => x.UpdatedBy).HasColumnName("updated_by");
        builder.Property(x => x.CreatedAt).HasColumnName("created_at");
        builder.Property(x => x.UpdatedAt).HasColumnName("updated_at");

        builder.HasIndex(x => x.InvoiceNumber).IsUnique().HasDatabaseName("ix_ar_invoices_number");
        builder.HasIndex(x => new { x.TenantNodeId, x.Status }).HasDatabaseName("ix_ar_invoices_tenant_status");
        builder.HasIndex(x => x.CustomerId).HasDatabaseName("ix_ar_invoices_customer");
        builder.HasIndex(x => new { x.SourceType, x.SourceId }).HasDatabaseName("ix_ar_invoices_source");
    }
}
