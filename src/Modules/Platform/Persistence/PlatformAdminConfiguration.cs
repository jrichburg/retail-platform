using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Modules.Platform.Domain.Entities;

namespace Modules.Platform.Persistence;

public class PlatformAdminConfiguration : IEntityTypeConfiguration<PlatformAdmin>
{
    public void Configure(EntityTypeBuilder<PlatformAdmin> builder)
    {
        builder.ToTable("platform_admins");

        builder.HasKey(x => x.Id);
        builder.Property(x => x.Id).HasColumnName("id");
        builder.Property(x => x.SupabaseUserId).HasColumnName("supabase_user_id").IsRequired();
        builder.Property(x => x.Email).HasColumnName("email").HasMaxLength(256).IsRequired();
        builder.Property(x => x.Name).HasColumnName("name").HasMaxLength(256).IsRequired();
        builder.Property(x => x.IsActive).HasColumnName("is_active").HasDefaultValue(true);
        builder.Property(x => x.CreatedAt).HasColumnName("created_at");
        builder.Property(x => x.UpdatedAt).HasColumnName("updated_at");

        builder.HasIndex(x => x.SupabaseUserId).IsUnique();
        builder.HasIndex(x => x.Email).IsUnique();
    }
}
