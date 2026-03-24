using SharedKernel.Domain;

namespace Modules.Tenants.Domain.Entities;

public class TenantSetting : BaseEntity
{
    public Guid TenantNodeId { get; set; }
    public string SettingsKey { get; set; } = string.Empty;
    public string SettingsValue { get; set; } = string.Empty; // JSON
    public bool IsLocked { get; set; }

    // Navigation
    public TenantNode TenantNode { get; set; } = null!;
}
