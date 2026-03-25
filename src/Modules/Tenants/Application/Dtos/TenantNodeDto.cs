namespace Modules.Tenants.Application.Dtos;

public class TenantNodeDto
{
    public Guid Id { get; set; }
    public Guid RootTenantId { get; set; }
    public Guid? ParentId { get; set; }
    public string NodeType { get; set; } = string.Empty;
    public string Name { get; set; } = string.Empty;
    public string? Code { get; set; }
    public string Path { get; set; } = string.Empty;
    public int Depth { get; set; }
    public bool IsActive { get; set; }
}
