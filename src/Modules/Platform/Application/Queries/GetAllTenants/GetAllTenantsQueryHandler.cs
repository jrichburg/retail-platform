using Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;
using Modules.Auth.Domain.Entities;
using Modules.Platform.Application.Dtos;
using Modules.Tenants.Domain.Entities;
using SharedKernel;
using SharedKernel.Application;

namespace Modules.Platform.Application.Queries.GetAllTenants;

public class GetAllTenantsQueryHandler : IQueryHandler<GetAllTenantsQuery, List<TenantSummaryDto>>
{
    private readonly AppDbContext _db;

    public GetAllTenantsQueryHandler(AppDbContext db)
    {
        _db = db;
    }

    public async Task<Result<List<TenantSummaryDto>>> Handle(GetAllTenantsQuery request, CancellationToken cancellationToken)
    {
        var roots = await _db.Set<TenantNode>()
            .IgnoreQueryFilters()
            .Where(t => t.NodeType == "root")
            .AsNoTracking()
            .OrderBy(t => t.Name)
            .ToListAsync(cancellationToken);

        var rootIds = roots.Select(r => r.Id).ToList();

        var storeCounts = await _db.Set<TenantNode>()
            .IgnoreQueryFilters()
            .Where(t => t.NodeType == "store" && rootIds.Contains(t.RootTenantId))
            .GroupBy(t => t.RootTenantId)
            .Select(g => new { RootTenantId = g.Key, Count = g.Count() })
            .ToListAsync(cancellationToken);

        var userCounts = await _db.Set<AppUser>()
            .IgnoreQueryFilters()
            .Where(u => rootIds.Contains(u.RootTenantId))
            .GroupBy(u => u.RootTenantId)
            .Select(g => new { RootTenantId = g.Key, Count = g.Count() })
            .ToListAsync(cancellationToken);

        var storeMap = storeCounts.ToDictionary(x => x.RootTenantId, x => x.Count);
        var userMap = userCounts.ToDictionary(x => x.RootTenantId, x => x.Count);

        var result = roots.Select(r => new TenantSummaryDto
        {
            Id = r.Id,
            Name = r.Name,
            Code = r.Code ?? string.Empty,
            IsActive = r.IsActive,
            CreatedAt = r.CreatedAt,
            StoreCount = storeMap.GetValueOrDefault(r.Id, 0),
            UserCount = userMap.GetValueOrDefault(r.Id, 0),
        }).ToList();

        return Result.Success(result);
    }
}
