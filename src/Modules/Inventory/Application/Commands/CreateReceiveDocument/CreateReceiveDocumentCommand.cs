using SharedKernel.Application;

namespace Modules.Inventory.Application.Commands.CreateReceiveDocument;

public record CreateReceiveDocumentCommand(
    List<ReceiveLineInput> Lines,
    string? Notes
) : ICommand<Guid>;

public record ReceiveLineInput(
    Guid ProductId,
    Guid? ProductVariantId,
    string ProductName,
    string Sku,
    string? Upc,
    string? VariantDescription,
    int Quantity
);
