using SharedKernel.Application;

namespace Modules.Catalog.Application.Commands.UpdateProduct;

public record UpdateProductCommand(
    Guid Id,
    string Name,
    string Sku,
    Guid CategoryId,
    Guid? SupplierId,
    string? Style,
    string? Color,
    DateTime? MapDate,
    Guid? SizeGridId,
    decimal RetailPrice,
    decimal? CostPrice,
    string? Description,
    bool IsActive,
    List<CreateProduct.ProductVariantInput>? Variants
) : ICommand;
