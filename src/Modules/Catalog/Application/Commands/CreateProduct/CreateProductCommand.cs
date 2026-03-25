using SharedKernel.Application;

namespace Modules.Catalog.Application.Commands.CreateProduct;

public record CreateProductCommand(
    string Name,
    string Sku,
    string? Upc,
    Guid CategoryId,
    decimal RetailPrice,
    decimal? CostPrice,
    string? Description
) : ICommand<Guid>;
