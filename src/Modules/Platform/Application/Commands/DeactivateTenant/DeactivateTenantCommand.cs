using SharedKernel.Application;

namespace Modules.Platform.Application.Commands.DeactivateTenant;

public record DeactivateTenantCommand(Guid TenantId) : ICommand;
