using SharedKernel.Domain;

namespace Modules.Catalog.Domain.Entities;

public class ProductVariant : TenantScopedEntity
{
    public Guid ProductId { get; set; }
    public string? Dimension1Value { get; set; }
    public string? Dimension2Value { get; set; }
    public string? Upc { get; set; }
    public bool IsActive { get; set; } = true;

    public Product Product { get; set; } = null!;
}
