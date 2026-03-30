using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Modules.Inventory.Domain.Entities;

namespace Modules.Inventory.Persistence;

public class ReceiveDocumentConfiguration : IEntityTypeConfiguration<ReceiveDocument>
{
    public void Configure(EntityTypeBuilder<ReceiveDocument> builder)
    {
        builder.ToTable("receive_documents");

        builder.HasKey(x => x.Id);
        builder.Property(x => x.Id).HasColumnName("id");
        builder.Property(x => x.TenantNodeId).HasColumnName("tenant_node_id").IsRequired();
        builder.Property(x => x.RootTenantId).HasColumnName("root_tenant_id").IsRequired();
        builder.Property(x => x.DocumentNumber).HasColumnName("document_number").IsRequired().HasMaxLength(50);
        builder.Property(x => x.PurchaseOrderId).HasColumnName("purchase_order_id");
        builder.Property(x => x.Status).HasColumnName("status").IsRequired().HasMaxLength(30);
        builder.Property(x => x.Notes).HasColumnName("notes").HasMaxLength(500);
        builder.Property(x => x.CreatedBy).HasColumnName("created_by");
        builder.Property(x => x.UpdatedBy).HasColumnName("updated_by");
        builder.Property(x => x.CreatedAt).HasColumnName("created_at");
        builder.Property(x => x.UpdatedAt).HasColumnName("updated_at");

        builder.HasIndex(x => new { x.TenantNodeId, x.CreatedAt }).HasDatabaseName("ix_receive_documents_tenant_date");
        builder.HasIndex(x => x.DocumentNumber).IsUnique().HasDatabaseName("ix_receive_documents_number");
    }
}
