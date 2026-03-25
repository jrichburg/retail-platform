using SharedKernel.Domain;

namespace Modules.Auth.Domain.Entities;

public class AppUserRole : BaseEntity
{
    public Guid AppUserId { get; set; }
    public Guid RoleId { get; set; }
    public Guid TenantNodeId { get; set; }

    public AppUser AppUser { get; set; } = null!;
    public Role Role { get; set; } = null!;
}
