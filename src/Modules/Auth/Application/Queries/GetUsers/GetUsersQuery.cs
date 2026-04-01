using SharedKernel.Application;
using Modules.Auth.Application.Dtos;

namespace Modules.Auth.Application.Queries.GetUsers;

public record GetUsersQuery(int Page = 1, int PageSize = 25, string? Search = null, bool? IsActive = null) : IQuery<PagedResult<AppUserListDto>>;
