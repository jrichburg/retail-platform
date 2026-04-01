using Infrastructure.Persistence;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Modules.Platform.Domain.Entities;

namespace Modules.Platform.Application.Authorization;

[AttributeUsage(AttributeTargets.Class | AttributeTargets.Method)]
public class RequirePlatformAdminAttribute : Attribute, IAsyncAuthorizationFilter
{
    public async Task OnAuthorizationAsync(AuthorizationFilterContext context)
    {
        var user = context.HttpContext.User;
        if (user?.Identity?.IsAuthenticated != true)
        {
            context.Result = new UnauthorizedResult();
            return;
        }

        var subClaim = user.FindFirst("sub")?.Value;
        if (string.IsNullOrEmpty(subClaim) || !Guid.TryParse(subClaim, out var supabaseUserId))
        {
            context.Result = new ForbidResult();
            return;
        }

        var db = context.HttpContext.RequestServices.GetRequiredService<AppDbContext>();
        var isAdmin = await db.Set<PlatformAdmin>()
            .AsNoTracking()
            .AnyAsync(a => a.SupabaseUserId == supabaseUserId && a.IsActive);

        if (!isAdmin)
        {
            context.Result = new ObjectResult(new { message = "Platform admin access required." })
            {
                StatusCode = 403
            };
        }
    }
}
