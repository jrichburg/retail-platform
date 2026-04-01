using SharedKernel.Application;

namespace Modules.Platform.Application.Commands.CreateTenant;

public record CreateTenantCommand(
    string Name,
    string Code,
    string AdminEmail,
    string AdminFirstName,
    string AdminLastName
) : ICommand<Guid>;
