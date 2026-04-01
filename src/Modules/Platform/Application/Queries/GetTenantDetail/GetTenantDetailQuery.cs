using Modules.Platform.Application.Dtos;
using SharedKernel.Application;

namespace Modules.Platform.Application.Queries.GetTenantDetail;

public record GetTenantDetailQuery(Guid TenantId) : IQuery<TenantDetailDto>;
