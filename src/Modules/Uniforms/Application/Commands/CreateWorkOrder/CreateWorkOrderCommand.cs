using SharedKernel.Application;

namespace Modules.Uniforms.Application.Commands.CreateWorkOrder;

public record CreateWorkOrderCommand(
    Guid CustomerId,
    string CustomerName,
    string? CustomerPhone,
    string? CustomerEmail,
    DateTime? DueDate,
    string? Notes,
    List<WorkOrderLineInput> Lines
) : ICommand<Guid>;

public record WorkOrderLineInput(
    string Description,
    Guid? ProductVariantId,
    string? ProductName,
    string? Sku,
    int Quantity,
    decimal UnitPrice
);
