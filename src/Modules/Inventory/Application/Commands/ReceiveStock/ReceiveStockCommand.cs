using SharedKernel.Application;

namespace Modules.Inventory.Application.Commands.ReceiveStock;

public record ReceiveStockCommand(Guid ProductId, int Quantity, string? Reference, string? Notes) : ICommand;
