using SharedKernel.Domain;

namespace Modules.Catalog.Domain.Entities;

public class Department : TenantScopedEntity, IAuditableEntity
{
    public string Name { get; set; } = string.Empty;
    public int SortOrder { get; set; }
    public bool IsActive { get; set; } = true;
    public Guid CreatedBy { get; set; }
    public Guid? UpdatedBy { get; set; }

    public ICollection<Category> Categories { get; set; } = new List<Category>();
}
