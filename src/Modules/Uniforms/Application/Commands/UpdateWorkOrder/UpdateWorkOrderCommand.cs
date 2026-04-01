using SharedKernel.Application;
using Modules.Uniforms.Application.Commands.CreateWorkOrder;

namespace Modules.Uniforms.Application.Commands.UpdateWorkOrder;

public record UpdateWorkOrderCommand(
    Guid Id,
    Guid CustomerId,
    string CustomerName,
    string? CustomerPhone,
    string? CustomerEmail,
    DateTime? DueDate,
    string? Notes,
    List<WorkOrderLineInput> Lines
) : ICommand;
