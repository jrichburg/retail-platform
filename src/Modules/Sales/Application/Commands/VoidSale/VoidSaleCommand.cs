using SharedKernel.Application;

namespace Modules.Sales.Application.Commands.VoidSale;

public record VoidSaleCommand(Guid SaleId) : ICommand;
