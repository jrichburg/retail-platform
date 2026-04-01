using SharedKernel.Application;

namespace Modules.Uniforms.Application.Commands.SubmitWorkOrder;

public record SubmitWorkOrderCommand(Guid Id) : ICommand;
