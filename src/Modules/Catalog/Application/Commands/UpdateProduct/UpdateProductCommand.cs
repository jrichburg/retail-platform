using SharedKernel.Application;

namespace Modules.Catalog.Application.Commands.UpdateProduct;

public record UpdateProductCommand(
    Guid Id,
    string Name,
    string Sku,
    string? Upc,
    Guid CategoryId,
    decimal RetailPrice,
    decimal? CostPrice,
    string? Description,
    bool IsActive
) : ICommand;
