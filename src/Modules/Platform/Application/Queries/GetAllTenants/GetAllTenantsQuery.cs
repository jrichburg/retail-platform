using Modules.Platform.Application.Dtos;
using SharedKernel.Application;

namespace Modules.Platform.Application.Queries.GetAllTenants;

public record GetAllTenantsQuery : IQuery<List<TenantSummaryDto>>;
