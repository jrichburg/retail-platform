using SharedKernel.Application;

namespace Modules.Auth.Application.Commands.UpdateUser;

public record UpdateUserCommand(Guid Id, string FirstName, string LastName, bool IsActive) : ICommand;
