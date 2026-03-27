using SharedKernel.Application;

namespace Modules.Inventory.Application.Commands.AdjustStock;

public record AdjustStockCommand(Guid ProductId, Guid? ProductVariantId, int Quantity, string Reason) : ICommand;
