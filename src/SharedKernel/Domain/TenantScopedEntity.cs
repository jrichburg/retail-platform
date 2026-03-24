namespace SharedKernel.Domain;

public abstract class TenantScopedEntity : BaseEntity
{
    public Guid TenantNodeId { get; set; }
    public Guid RootTenantId { get; set; }
}
