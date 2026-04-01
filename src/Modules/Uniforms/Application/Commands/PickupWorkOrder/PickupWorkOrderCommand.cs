using SharedKernel.Application;

namespace Modules.Uniforms.Application.Commands.PickupWorkOrder;

public record PickupWorkOrderCommand(Guid Id) : ICommand;
