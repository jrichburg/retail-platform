using SharedKernel.Application;
using Modules.Tenants.Application.Dtos;

namespace Modules.Tenants.Application.Queries.GetTenantSettings;

public record GetTenantSettingsQuery(Guid TenantNodeId) : IQuery<List<TenantSettingDto>>;
