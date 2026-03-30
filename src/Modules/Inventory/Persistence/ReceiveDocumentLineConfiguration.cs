using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Modules.Inventory.Domain.Entities;

namespace Modules.Inventory.Persistence;

public class ReceiveDocumentLineConfiguration : IEntityTypeConfiguration<ReceiveDocumentLine>
{
    public void Configure(EntityTypeBuilder<ReceiveDocumentLine> builder)
    {
        builder.ToTable("receive_document_lines");

        builder.HasKey(x => x.Id);
        builder.Property(x => x.Id).HasColumnName("id");
        builder.Property(x => x.ReceiveDocumentId).HasColumnName("receive_document_id").IsRequired();
        builder.Property(x => x.ProductId).HasColumnName("product_id").IsRequired();
        builder.Property(x => x.ProductVariantId).HasColumnName("product_variant_id");
        builder.Property(x => x.ProductName).HasColumnName("product_name").IsRequired().HasMaxLength(200);
        builder.Property(x => x.Sku).HasColumnName("sku").IsRequired().HasMaxLength(50);
        builder.Property(x => x.Upc).HasColumnName("upc").HasMaxLength(50);
        builder.Property(x => x.VariantDescription).HasColumnName("variant_description").HasMaxLength(100);
        builder.Property(x => x.Quantity).HasColumnName("quantity").IsRequired();
        builder.Property(x => x.CreatedAt).HasColumnName("created_at");
        builder.Property(x => x.UpdatedAt).HasColumnName("updated_at");

        builder.HasOne(x => x.ReceiveDocument).WithMany(x => x.Lines).HasForeignKey(x => x.ReceiveDocumentId).OnDelete(DeleteBehavior.Cascade);

        builder.HasIndex(x => x.ReceiveDocumentId).HasDatabaseName("ix_receive_document_lines_document");
    }
}
