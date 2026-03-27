using SharedKernel.Domain;

namespace Modules.Catalog.Domain.Entities;

public class Supplier : TenantScopedEntity, IAuditableEntity
{
    public string Name { get; set; } = string.Empty;
    public string? Code { get; set; }
    public bool IsActive { get; set; } = true;
    public Guid CreatedBy { get; set; }
    public Guid? UpdatedBy { get; set; }

    public ICollection<Product> Products { get; set; } = new List<Product>();
}
