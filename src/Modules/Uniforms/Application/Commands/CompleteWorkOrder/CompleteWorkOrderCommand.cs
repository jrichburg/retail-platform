using SharedKernel.Application;

namespace Modules.Uniforms.Application.Commands.CompleteWorkOrder;

public record CompleteWorkOrderCommand(Guid Id) : ICommand;
