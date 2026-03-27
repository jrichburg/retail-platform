using SharedKernel.Application;

namespace Modules.Inventory.Application.Commands.ReceiveStock;

public record ReceiveStockCommand(Guid ProductId, Guid? ProductVariantId, int Quantity, string? Reference, string? Notes) : ICommand;
