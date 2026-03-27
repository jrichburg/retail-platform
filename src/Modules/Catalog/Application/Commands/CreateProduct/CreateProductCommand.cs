using SharedKernel.Application;

namespace Modules.Catalog.Application.Commands.CreateProduct;

public record CreateProductCommand(
    string Name,
    string Sku,
    Guid CategoryId,
    Guid? SupplierId,
    string? Color,
    DateTime? MapDate,
    Guid? SizeGridId,
    decimal RetailPrice,
    decimal? CostPrice,
    string? Description,
    List<ProductVariantInput>? Variants
) : ICommand<Guid>;

public record ProductVariantInput(string? Dimension1Value, string? Dimension2Value, string? Upc);
