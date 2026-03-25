using Microsoft.AspNetCore.Http;
using SharedKernel.Application;

namespace Infrastructure.Services;

public class TenantContext : ITenantContext
{
    private readonly IHttpContextAccessor _httpContextAccessor;

    public TenantContext(IHttpContextAccessor httpContextAccessor)
    {
        _httpContextAccessor = httpContextAccessor;
    }

    public Guid TenantNodeId =>
        _httpContextAccessor.HttpContext?.Items["TenantNodeId"] is Guid id
            ? id
            : Guid.Empty;

    public Guid RootTenantId =>
        _httpContextAccessor.HttpContext?.Items["RootTenantId"] is Guid id
            ? id
            : Guid.Empty;
}
