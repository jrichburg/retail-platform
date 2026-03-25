using Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;

namespace Api.Middleware;

public class TenantResolutionMiddleware
{
    private readonly RequestDelegate _next;

    public TenantResolutionMiddleware(RequestDelegate next)
    {
        _next = next;
    }

    public async Task InvokeAsync(HttpContext context, AppDbContext dbContext)
    {
        // Skip tenant resolution for non-API routes and health checks
        var path = context.Request.Path.Value ?? "";
        if (!path.StartsWith("/api/") || path.StartsWith("/api/v1/health"))
        {
            await _next(context);
            return;
        }

        // Skip for auth endpoints that don't require tenant context
        if (path.StartsWith("/api/v1/auth/"))
        {
            await _next(context);
            return;
        }

        // Try header first, then JWT claim
        string? tenantNodeIdStr = context.Request.Headers["X-Tenant-Node-Id"].FirstOrDefault();

        if (string.IsNullOrEmpty(tenantNodeIdStr))
        {
            tenantNodeIdStr = context.User?.FindFirst("tenant_node_id")?.Value;
        }

        if (string.IsNullOrEmpty(tenantNodeIdStr) || !Guid.TryParse(tenantNodeIdStr, out var tenantNodeId))
        {
            context.Response.StatusCode = 400;
            await context.Response.WriteAsJsonAsync(new { message = "Missing or invalid tenant context. Provide X-Tenant-Node-Id header." });
            return;
        }

        // Look up the tenant node to get RootTenantId
        var tenantNode = await dbContext.Set<Modules.Tenants.Domain.Entities.TenantNode>()
            .AsNoTracking()
            .FirstOrDefaultAsync(t => t.Id == tenantNodeId && t.IsActive);

        if (tenantNode == null)
        {
            context.Response.StatusCode = 400;
            await context.Response.WriteAsJsonAsync(new { message = "Tenant node not found or inactive." });
            return;
        }

        context.Items["TenantNodeId"] = tenantNode.Id;
        context.Items["RootTenantId"] = tenantNode.RootTenantId;

        await _next(context);
    }
}
