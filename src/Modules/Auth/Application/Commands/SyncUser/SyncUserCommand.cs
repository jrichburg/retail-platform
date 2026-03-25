using SharedKernel.Application;
using Modules.Auth.Application.Dtos;

namespace Modules.Auth.Application.Commands.SyncUser;

public record SyncUserCommand(
    Guid SupabaseUserId,
    string Email,
    string? FirstName,
    string? LastName,
    Guid TenantNodeId,
    Guid RootTenantId
) : ICommand<AuthUserDto>;
