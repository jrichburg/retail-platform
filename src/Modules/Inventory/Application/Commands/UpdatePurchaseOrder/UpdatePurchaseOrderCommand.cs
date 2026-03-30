using SharedKernel.Application;

namespace Modules.Inventory.Application.Commands.UpdatePurchaseOrder;

public record UpdatePurchaseOrderCommand(
    Guid Id,
    string? Notes,
    DateTime? ExpectedDate,
    List<CreatePurchaseOrder.PurchaseOrderLineInput> Lines
) : ICommand;
