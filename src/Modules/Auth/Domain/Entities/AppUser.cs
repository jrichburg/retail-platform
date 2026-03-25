using SharedKernel.Domain;

namespace Modules.Auth.Domain.Entities;

public class AppUser : TenantScopedEntity, IAuditableEntity
{
    public Guid SupabaseUserId { get; set; }
    public string Email { get; set; } = string.Empty;
    public string FirstName { get; set; } = string.Empty;
    public string LastName { get; set; } = string.Empty;
    public bool IsActive { get; set; } = true;
    public Guid CreatedBy { get; set; }
    public Guid? UpdatedBy { get; set; }

    public ICollection<AppUserRole> UserRoles { get; set; } = new List<AppUserRole>();
}
