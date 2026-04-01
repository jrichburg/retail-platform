using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Modules.AccountsReceivable.Domain.Entities;

namespace Modules.AccountsReceivable.Persistence;

public class PaymentConfiguration : IEntityTypeConfiguration<Payment>
{
    public void Configure(EntityTypeBuilder<Payment> builder)
    {
        builder.ToTable("ar_payments");
        builder.HasKey(x => x.Id);
        builder.Property(x => x.Id).HasColumnName("id");
        builder.Property(x => x.TenantNodeId).HasColumnName("tenant_node_id").IsRequired();
        builder.Property(x => x.RootTenantId).HasColumnName("root_tenant_id").IsRequired();
        builder.Property(x => x.PaymentNumber).HasColumnName("payment_number").IsRequired().HasMaxLength(50);
        builder.Property(x => x.InvoiceId).HasColumnName("invoice_id").IsRequired();
        builder.Property(x => x.CustomerId).HasColumnName("customer_id").IsRequired();
        builder.Property(x => x.Amount).HasColumnName("amount").HasColumnType("decimal(10,2)");
        builder.Property(x => x.PaymentMethod).HasColumnName("payment_method").IsRequired().HasMaxLength(30);
        builder.Property(x => x.PaymentDate).HasColumnName("payment_date").IsRequired();
        builder.Property(x => x.Reference).HasColumnName("reference").HasMaxLength(100);
        builder.Property(x => x.Notes).HasColumnName("notes").HasMaxLength(500);
        builder.Property(x => x.CreatedBy).HasColumnName("created_by");
        builder.Property(x => x.UpdatedBy).HasColumnName("updated_by");
        builder.Property(x => x.CreatedAt).HasColumnName("created_at");
        builder.Property(x => x.UpdatedAt).HasColumnName("updated_at");

        builder.HasOne(x => x.Invoice).WithMany(x => x.Payments).HasForeignKey(x => x.InvoiceId).OnDelete(DeleteBehavior.Cascade);
        builder.HasIndex(x => x.PaymentNumber).IsUnique().HasDatabaseName("ix_ar_payments_number");
        builder.HasIndex(x => x.InvoiceId).HasDatabaseName("ix_ar_payments_invoice");
        builder.HasIndex(x => x.CustomerId).HasDatabaseName("ix_ar_payments_customer");
    }
}
