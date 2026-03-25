using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Modules.Sales.Domain.Entities;

namespace Modules.Sales.Persistence;

public class SaleTenderConfiguration : IEntityTypeConfiguration<SaleTender>
{
    public void Configure(EntityTypeBuilder<SaleTender> builder)
    {
        builder.ToTable("sale_tenders");
        builder.HasKey(x => x.Id);
        builder.Property(x => x.Id).HasColumnName("id");
        builder.Property(x => x.SaleId).HasColumnName("sale_id").IsRequired();
        builder.Property(x => x.TenderType).HasColumnName("tender_type").IsRequired().HasMaxLength(20);
        builder.Property(x => x.Amount).HasColumnName("amount").HasColumnType("decimal(10,2)");
        builder.Property(x => x.PaymentReference).HasColumnName("payment_reference").HasMaxLength(100);
        builder.Property(x => x.PaymentDetails).HasColumnName("payment_details").HasColumnType("jsonb");
        builder.Property(x => x.CreatedAt).HasColumnName("created_at");
        builder.Property(x => x.UpdatedAt).HasColumnName("updated_at");

        builder.HasOne(x => x.Sale).WithMany(x => x.Tenders).HasForeignKey(x => x.SaleId).OnDelete(DeleteBehavior.Cascade);
    }
}
