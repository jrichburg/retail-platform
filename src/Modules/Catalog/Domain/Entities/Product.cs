using SharedKernel.Domain;

namespace Modules.Catalog.Domain.Entities;

public class Product : TenantScopedEntity, IAuditableEntity
{
    public string Name { get; set; } = string.Empty;
    public string Sku { get; set; } = string.Empty;
    public string? Upc { get; set; }
    public Guid CategoryId { get; set; }
    public decimal RetailPrice { get; set; }
    public decimal? CostPrice { get; set; }
    public string? Description { get; set; }
    public bool IsActive { get; set; } = true;
    public Guid CreatedBy { get; set; }
    public Guid? UpdatedBy { get; set; }

    public Category Category { get; set; } = null!;
}
