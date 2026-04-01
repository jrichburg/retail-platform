using SharedKernel.Application;
using Modules.Auth.Application.Dtos;

namespace Modules.Auth.Application.Queries.GetRoles;

public record GetRolesQuery() : IQuery<List<RoleDto>>;
