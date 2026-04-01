namespace Modules.Tenants.Application.Dtos;

public class TenantSettingDto
{
    public Guid Id { get; set; }
    public Guid TenantNodeId { get; set; }
    public string SettingsKey { get; set; } = string.Empty;
    public string SettingsValue { get; set; } = string.Empty;
    public bool IsLocked { get; set; }
}
