using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Modules.Catalog.Domain.Entities;

namespace Modules.Catalog.Persistence;

public class SizeGridValueConfiguration : IEntityTypeConfiguration<SizeGridValue>
{
    public void Configure(EntityTypeBuilder<SizeGridValue> builder)
    {
        builder.ToTable("size_grid_values");

        builder.HasKey(x => x.Id);
        builder.Property(x => x.Id).HasColumnName("id");
        builder.Property(x => x.SizeGridId).HasColumnName("size_grid_id").IsRequired();
        builder.Property(x => x.Dimension).HasColumnName("dimension").IsRequired();
        builder.Property(x => x.Value).HasColumnName("value").IsRequired().HasMaxLength(20);
        builder.Property(x => x.SortOrder).HasColumnName("sort_order");
        builder.Property(x => x.CreatedAt).HasColumnName("created_at");
        builder.Property(x => x.UpdatedAt).HasColumnName("updated_at");

        builder.HasOne(x => x.SizeGrid).WithMany(x => x.Values).HasForeignKey(x => x.SizeGridId).OnDelete(DeleteBehavior.Cascade);

        builder.HasIndex(x => new { x.SizeGridId, x.Dimension, x.Value }).IsUnique().HasDatabaseName("ix_size_grid_values_unique");
        builder.HasIndex(x => new { x.SizeGridId, x.Dimension, x.SortOrder }).HasDatabaseName("ix_size_grid_values_order");
    }
}
