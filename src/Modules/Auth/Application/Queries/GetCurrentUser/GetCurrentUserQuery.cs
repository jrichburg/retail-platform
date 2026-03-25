using SharedKernel.Application;
using Modules.Auth.Application.Dtos;

namespace Modules.Auth.Application.Queries.GetCurrentUser;

public record GetCurrentUserQuery(Guid SupabaseUserId) : IQuery<AuthUserDto>;
