using SharedKernel.Domain;

namespace Modules.Catalog.Domain.Entities;

public class Category : TenantScopedEntity, IAuditableEntity
{
    public Guid DepartmentId { get; set; }
    public string Name { get; set; } = string.Empty;
    public int SortOrder { get; set; }
    public bool IsActive { get; set; } = true;
    public Guid CreatedBy { get; set; }
    public Guid? UpdatedBy { get; set; }

    public Department Department { get; set; } = null!;
    public ICollection<Product> Products { get; set; } = new List<Product>();
}
