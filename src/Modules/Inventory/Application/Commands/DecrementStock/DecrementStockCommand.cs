using SharedKernel.Application;

namespace Modules.Inventory.Application.Commands.DecrementStock;

public record DecrementStockCommand(Guid ProductId, int Quantity, Guid SaleId, Guid TenantNodeId, Guid RootTenantId) : ICommand;
