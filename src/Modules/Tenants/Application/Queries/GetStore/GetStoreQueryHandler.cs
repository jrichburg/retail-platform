using Microsoft.EntityFrameworkCore;
using Infrastructure.Persistence;
using Modules.Tenants.Application.Dtos;
using Modules.Tenants.Domain.Entities;
using SharedKernel;
using SharedKernel.Application;

namespace Modules.Tenants.Application.Queries.GetStore;

public class GetStoreQueryHandler : IQueryHandler<GetStoreQuery, TenantNodeDto>
{
    private readonly AppDbContext _db;

    public GetStoreQueryHandler(AppDbContext db)
    {
        _db = db;
    }

    public async Task<Result<TenantNodeDto>> Handle(GetStoreQuery request, CancellationToken cancellationToken)
    {
        var node = await _db.Set<TenantNode>()
            .AsNoTracking()
            .Where(n => n.Id == request.Id)
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
            .FirstOrDefaultAsync(cancellationToken);

        if (node == null)
            return Result.Failure<TenantNodeDto>("Store not found.");

        return Result.Success(node);
    }
}
