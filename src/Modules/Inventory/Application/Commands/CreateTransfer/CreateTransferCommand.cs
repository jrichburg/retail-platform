using SharedKernel.Application;

namespace Modules.Inventory.Application.Commands.CreateTransfer;

public record CreateTransferCommand(
    Guid DestinationTenantNodeId,
    List<TransferLineInput> Lines,
    string? Notes
) : ICommand<Guid>;

public record TransferLineInput(
    Guid ProductId,
    Guid? ProductVariantId,
    string ProductName,
    string Sku,
    string? Upc,
    string? VariantDescription,
    int Quantity
);
