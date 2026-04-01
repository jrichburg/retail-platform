using SharedKernel.Application;

namespace Modules.Auth.Application.Commands.CreateUser;

public record CreateUserCommand(
    string Email,
    string FirstName,
    string LastName,
    Guid RoleId
) : ICommand<Guid>;
