using SharedKernel.Application;

namespace Modules.Inventory.Application.Commands.ClosePurchaseOrder;

public record ClosePurchaseOrderCommand(Guid Id) : ICommand;
