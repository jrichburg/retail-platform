using SharedKernel.Application;
using Modules.Tenants.Application.Dtos;

namespace Modules.Tenants.Application.Queries.GetTenantTree;

public record GetTenantTreeQuery() : IQuery<List<TenantNodeDto>>;
