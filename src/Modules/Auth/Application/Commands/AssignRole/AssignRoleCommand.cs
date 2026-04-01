using SharedKernel.Application;

namespace Modules.Auth.Application.Commands.AssignRole;

public record AssignRoleCommand(Guid UserId, Guid RoleId) : ICommand;
