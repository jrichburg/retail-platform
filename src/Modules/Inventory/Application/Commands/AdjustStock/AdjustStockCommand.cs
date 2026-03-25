using SharedKernel.Application;

namespace Modules.Inventory.Application.Commands.AdjustStock;

public record AdjustStockCommand(Guid ProductId, int Quantity, string Reason) : ICommand;
