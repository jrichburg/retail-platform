using SharedKernel.Domain;

namespace Modules.Catalog.Domain.Entities;

public class SizeGrid : TenantScopedEntity, IAuditableEntity
{
    public string Name { get; set; } = string.Empty;
    public string Dimension1Label { get; set; } = "Size";
    public string? Dimension2Label { get; set; }
    public bool IsActive { get; set; } = true;
    public Guid CreatedBy { get; set; }
    public Guid? UpdatedBy { get; set; }

    public ICollection<SizeGridValue> Values { get; set; } = new List<SizeGridValue>();
    public ICollection<Product> Products { get; set; } = new List<Product>();
}
