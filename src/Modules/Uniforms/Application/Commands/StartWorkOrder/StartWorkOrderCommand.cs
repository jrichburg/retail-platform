using SharedKernel.Application;

namespace Modules.Uniforms.Application.Commands.StartWorkOrder;

public record StartWorkOrderCommand(Guid Id) : ICommand;
