namespace SharedKernel.Application;

public interface ITenantContext
{
    Guid TenantNodeId { get; }
    Guid RootTenantId { get; }
}
