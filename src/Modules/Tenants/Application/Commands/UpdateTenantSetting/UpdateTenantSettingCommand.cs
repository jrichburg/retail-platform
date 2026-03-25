using SharedKernel.Application;

namespace Modules.Tenants.Application.Commands.UpdateTenantSetting;

public record UpdateTenantSettingCommand(Guid TenantNodeId, string SettingsKey, string SettingsValue, bool? IsLocked) : ICommand;
