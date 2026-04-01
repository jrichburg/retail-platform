using SharedKernel.Domain;

namespace Modules.Platform.Domain.Entities;

public class PlatformAdmin : BaseEntity
{
    public Guid SupabaseUserId { get; set; }
    public string Email { get; set; } = string.Empty;
    public string Name { get; set; } = string.Empty;
    public bool IsActive { get; set; } = true;
}
