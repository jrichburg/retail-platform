using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Modules.Sales.Domain.Entities;

namespace Modules.Sales.Persistence;

public class SaleLineItemConfiguration : IEntityTypeConfiguration<SaleLineItem>
{
    public void Configure(EntityTypeBuilder<SaleLineItem> builder)
    {
        builder.ToTable("sale_line_items");
        builder.HasKey(x => x.Id);
        builder.Property(x => x.Id).HasColumnName("id");
        builder.Property(x => x.SaleId).HasColumnName("sale_id").IsRequired();
        builder.Property(x => x.ProductId).HasColumnName("product_id").IsRequired();
        builder.Property(x => x.Sku).HasColumnName("sku").IsRequired().HasMaxLength(50);
        builder.Property(x => x.ProductName).HasColumnName("product_name").IsRequired().HasMaxLength(200);
        builder.Property(x => x.Quantity).HasColumnName("quantity").IsRequired();
        builder.Property(x => x.UnitPrice).HasColumnName("unit_price").HasColumnType("decimal(10,2)");
        builder.Property(x => x.LineTotal).HasColumnName("line_total").HasColumnType("decimal(10,2)");
        builder.Property(x => x.DiscountAmount).HasColumnName("discount_amount").HasColumnType("decimal(10,2)");
        builder.Property(x => x.CreatedAt).HasColumnName("created_at");
        builder.Property(x => x.UpdatedAt).HasColumnName("updated_at");

        builder.HasOne(x => x.Sale).WithMany(x => x.LineItems).HasForeignKey(x => x.SaleId).OnDelete(DeleteBehavior.Cascade);
    }
}
