using SharedKernel.Application;
using Modules.Tenants.Application.Dtos;

namespace Modules.Tenants.Application.Queries.GetStore;

public record GetStoreQuery(Guid Id) : IQuery<TenantNodeDto>;
