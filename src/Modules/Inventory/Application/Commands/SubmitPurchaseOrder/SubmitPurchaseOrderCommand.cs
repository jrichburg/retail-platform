using SharedKernel.Application;

namespace Modules.Inventory.Application.Commands.SubmitPurchaseOrder;

public record SubmitPurchaseOrderCommand(Guid Id) : ICommand;
