using SharedKernel.Application;

namespace Modules.Inventory.Application.Commands.ReceiveAgainstPO;

public record ReceiveAgainstPOCommand(
    Guid PurchaseOrderId,
    List<ReceiveAgainstPOLineInput> Lines,
    string? Notes
) : ICommand<Guid>;

public record ReceiveAgainstPOLineInput(
    Guid ProductId,
    Guid? ProductVariantId,
    string ProductName,
    string Sku,
    string? Upc,
    string? VariantDescription,
    int Quantity
);
