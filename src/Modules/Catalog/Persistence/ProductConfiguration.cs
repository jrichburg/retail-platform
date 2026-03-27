using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Modules.Catalog.Domain.Entities;

namespace Modules.Catalog.Persistence;

public class ProductConfiguration : IEntityTypeConfiguration<Product>
{
    public void Configure(EntityTypeBuilder<Product> builder)
    {
        builder.ToTable("products");

        builder.HasKey(x => x.Id);
        builder.Property(x => x.Id).HasColumnName("id");
        builder.Property(x => x.TenantNodeId).HasColumnName("tenant_node_id").IsRequired();
        builder.Property(x => x.RootTenantId).HasColumnName("root_tenant_id").IsRequired();
        builder.Property(x => x.Name).HasColumnName("name").IsRequired().HasMaxLength(200);
        builder.Property(x => x.Sku).HasColumnName("sku").IsRequired().HasMaxLength(50);
        builder.Property(x => x.CategoryId).HasColumnName("category_id").IsRequired();
        builder.Property(x => x.SupplierId).HasColumnName("supplier_id");
        builder.Property(x => x.Style).HasColumnName("style").HasMaxLength(100);
        builder.Property(x => x.Color).HasColumnName("color").HasMaxLength(50);
        builder.Property(x => x.MapDate).HasColumnName("map_date");
        builder.Property(x => x.SizeGridId).HasColumnName("size_grid_id");
        builder.Property(x => x.RetailPrice).HasColumnName("retail_price").HasColumnType("decimal(10,2)").IsRequired();
        builder.Property(x => x.CostPrice).HasColumnName("cost_price").HasColumnType("decimal(10,2)");
        builder.Property(x => x.Description).HasColumnName("description").HasMaxLength(1000);
        builder.Property(x => x.IsActive).HasColumnName("is_active").HasDefaultValue(true);
        builder.Property(x => x.CreatedAt).HasColumnName("created_at");
        builder.Property(x => x.UpdatedAt).HasColumnName("updated_at");
        builder.Property(x => x.CreatedBy).HasColumnName("created_by");
        builder.Property(x => x.UpdatedBy).HasColumnName("updated_by");

        builder.HasOne(x => x.Category).WithMany(x => x.Products).HasForeignKey(x => x.CategoryId).OnDelete(DeleteBehavior.Restrict);
        builder.HasOne(x => x.Supplier).WithMany(x => x.Products).HasForeignKey(x => x.SupplierId).OnDelete(DeleteBehavior.Restrict);
        builder.HasOne(x => x.SizeGrid).WithMany(x => x.Products).HasForeignKey(x => x.SizeGridId).OnDelete(DeleteBehavior.Restrict);

        builder.HasIndex(x => new { x.RootTenantId, x.Sku }).IsUnique().HasDatabaseName("ix_products_tenant_sku");
    }
}
