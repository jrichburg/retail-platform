using Microsoft.EntityFrameworkCore;
using Infrastructure.Persistence;
using Modules.Tenants.Application.Dtos;
using Modules.Tenants.Domain.Entities;
using SharedKernel;
using SharedKernel.Application;

namespace Modules.Tenants.Application.Queries.GetTenantTree;

public class GetTenantTreeQueryHandler : IQueryHandler<GetTenantTreeQuery, List<TenantNodeDto>>
{
    private readonly AppDbContext _db;
    private readonly ITenantContext _tenantContext;

    public GetTenantTreeQueryHandler(AppDbContext db, ITenantContext tenantContext)
    {
        _db = db;
        _tenantContext = tenantContext;
    }

    public async Task<Result<List<TenantNodeDto>>> Handle(GetTenantTreeQuery request, CancellationToken cancellationToken)
    {
        var nodes = await _db.Set<TenantNode>()
            .AsNoTracking()
            .Where(n => n.RootTenantId == _tenantContext.RootTenantId)
            .OrderBy(n => n.Path)
            .Select(n => new TenantNodeDto
            {
                Id = n.Id,
                RootTenantId = n.RootTenantId,
                ParentId = n.ParentId,
                NodeType = n.NodeType,
                Name = n.Name,
                Code = n.Code,
                Path = n.Path,
                Depth = n.Depth,
                IsActive = n.IsActive,
            })
            .ToListAsync(cancellationToken);

        return Result.Success(nodes);
    }
}
