using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Modules.Customers.Domain.Entities;

namespace Modules.Customers.Persistence;

public class CustomerConfiguration : IEntityTypeConfiguration<Customer>
{
    public void Configure(EntityTypeBuilder<Customer> builder)
    {
        builder.ToTable("customers");
        builder.HasKey(x => x.Id);
        builder.Property(x => x.Id).HasColumnName("id");
        builder.Property(x => x.TenantNodeId).HasColumnName("tenant_node_id").IsRequired();
        builder.Property(x => x.RootTenantId).HasColumnName("root_tenant_id").IsRequired();
        builder.Property(x => x.FirstName).HasColumnName("first_name").IsRequired().HasMaxLength(100);
        builder.Property(x => x.LastName).HasColumnName("last_name").IsRequired().HasMaxLength(100);
        builder.Property(x => x.Email).HasColumnName("email").HasMaxLength(255);
        builder.Property(x => x.Phone).HasColumnName("phone").HasMaxLength(20);
        builder.Property(x => x.Street).HasColumnName("street").HasMaxLength(200);
        builder.Property(x => x.City).HasColumnName("city").HasMaxLength(100);
        builder.Property(x => x.State).HasColumnName("state").HasMaxLength(50);
        builder.Property(x => x.Zip).HasColumnName("zip").HasMaxLength(20);
        builder.Property(x => x.Notes).HasColumnName("notes").HasMaxLength(1000);
        builder.Property(x => x.IsActive).HasColumnName("is_active").HasDefaultValue(true);
        builder.Property(x => x.CreatedBy).HasColumnName("created_by");
        builder.Property(x => x.UpdatedBy).HasColumnName("updated_by");
        builder.Property(x => x.CreatedAt).HasColumnName("created_at");
        builder.Property(x => x.UpdatedAt).HasColumnName("updated_at");

        builder.HasIndex(x => new { x.RootTenantId, x.Email }).IsUnique().HasDatabaseName("ix_customers_tenant_email").HasFilter("email IS NOT NULL");
        builder.HasIndex(x => x.Phone).HasDatabaseName("ix_customers_phone");
        builder.HasIndex(x => new { x.RootTenantId, x.LastName }).HasDatabaseName("ix_customers_tenant_lastname");
    }
}
