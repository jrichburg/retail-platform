using SharedKernel.Domain;

namespace Modules.Tenants.Domain.Entities;

public class TenantNode : BaseEntity, IAuditableEntity
{
    public Guid RootTenantId { get; set; }
    public Guid? ParentId { get; set; }
    public string NodeType { get; set; } = string.Empty; // root, group, store
    public string Name { get; set; } = string.Empty;
    public string? Code { get; set; }
    public string Path { get; set; } = string.Empty; // ltree path
    public int Depth { get; set; }
    public bool IsActive { get; set; } = true;
    public Guid CreatedBy { get; set; }
    public Guid? UpdatedBy { get; set; }

    // Navigation
    public TenantNode? Parent { get; set; }
    public ICollection<TenantNode> Children { get; set; } = new List<TenantNode>();
    public ICollection<TenantSetting> Settings { get; set; } = new List<TenantSetting>();
}
