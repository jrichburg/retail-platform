using SharedKernel.Application;
using Modules.Sales.Application.Dtos;

namespace Modules.Sales.Application.Commands.CreateSale;

public record CreateSaleCommand(
    List<SaleItemInput> Items,
    List<SaleTenderInput> Tenders,
    Guid? CustomerId = null,
    string? CustomerName = null,
    Guid? ClientTransactionId = null // for offline idempotency
) : ICommand<SaleDto>;

public record SaleItemInput(Guid ProductId, Guid? ProductVariantId, int Quantity);
public record SaleTenderInput(string TenderType, decimal Amount);
