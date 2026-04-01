using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Modules.Inventory.Domain.Entities;

namespace Modules.Inventory.Persistence;

public class TransferDocumentConfiguration : IEntityTypeConfiguration<TransferDocument>
{
    public void Configure(EntityTypeBuilder<TransferDocument> builder)
    {
        builder.ToTable("transfer_documents");

        builder.HasKey(x => x.Id);
        builder.Property(x => x.Id).HasColumnName("id");
        builder.Property(x => x.TenantNodeId).HasColumnName("tenant_node_id").IsRequired();
        builder.Property(x => x.RootTenantId).HasColumnName("root_tenant_id").IsRequired();
        builder.Property(x => x.DocumentNumber).HasColumnName("document_number").HasMaxLength(50).IsRequired();
        builder.Property(x => x.SourceTenantNodeId).HasColumnName("source_tenant_node_id").IsRequired();
        builder.Property(x => x.DestinationTenantNodeId).HasColumnName("destination_tenant_node_id").IsRequired();
        builder.Property(x => x.Status).HasColumnName("status").HasMaxLength(30).IsRequired();
        builder.Property(x => x.Notes).HasColumnName("notes").HasMaxLength(500);
        builder.Property(x => x.CreatedBy).HasColumnName("created_by");
        builder.Property(x => x.UpdatedBy).HasColumnName("updated_by");
        builder.Property(x => x.CreatedAt).HasColumnName("created_at");
        builder.Property(x => x.UpdatedAt).HasColumnName("updated_at");

        builder.HasMany(x => x.Lines)
            .WithOne(x => x.TransferDocument)
            .HasForeignKey(x => x.TransferDocumentId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasIndex(x => new { x.TenantNodeId, x.CreatedAt })
            .HasDatabaseName("ix_transfer_documents_tenant_date");
        builder.HasIndex(x => x.DocumentNumber)
            .IsUnique()
            .HasDatabaseName("ix_transfer_documents_number");
        builder.HasIndex(x => x.Status)
            .HasDatabaseName("ix_transfer_documents_status");
    }
}
