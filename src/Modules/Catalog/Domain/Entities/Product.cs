using SharedKernel.Domain;

namespace Modules.Catalog.Domain.Entities;

public class Product : TenantScopedEntity, IAuditableEntity
{
    public string Name { get; set; } = string.Empty;
    public string Sku { get; set; } = string.Empty;
    public Guid CategoryId { get; set; }
    public Guid? SupplierId { get; set; }
    public string? Style { get; set; }
    public string? Color { get; set; }
    public DateTime? MapDate { get; set; }
    public Guid? SizeGridId { get; set; }
    public decimal RetailPrice { get; set; }
    public decimal? CostPrice { get; set; }
    public string? Description { get; set; }
    public bool IsActive { get; set; } = true;
    public Guid CreatedBy { get; set; }
    public Guid? UpdatedBy { get; set; }

    public Category Category { get; set; } = null!;
    public Supplier? Supplier { get; set; }
    public SizeGrid? SizeGrid { get; set; }
    public ICollection<ProductVariant> Variants { get; set; } = new List<ProductVariant>();
}
