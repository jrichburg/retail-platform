using Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;
using Modules.Auth.Domain.Entities;
using Modules.Platform.Application.Dtos;
using Modules.Tenants.Domain.Entities;
using SharedKernel;
using SharedKernel.Application;

namespace Modules.Platform.Application.Queries.GetTenantDetail;

public class GetTenantDetailQueryHandler : IQueryHandler<GetTenantDetailQuery, TenantDetailDto>
{
    private readonly AppDbContext _db;

    public GetTenantDetailQueryHandler(AppDbContext db)
    {
        _db = db;
    }

    public async Task<Result<TenantDetailDto>> Handle(GetTenantDetailQuery request, CancellationToken cancellationToken)
    {
        var root = await _db.Set<TenantNode>()
            .IgnoreQueryFilters()
            .AsNoTracking()
            .FirstOrDefaultAsync(t => t.Id == request.TenantId && t.NodeType == "root", cancellationToken);

        if (root == null)
            return Result.Failure<TenantDetailDto>("Tenant not found.");

        var stores = await _db.Set<TenantNode>()
            .IgnoreQueryFilters()
            .Where(t => t.RootTenantId == request.TenantId && t.NodeType == "store")
            .AsNoTracking()
            .OrderBy(t => t.Name)
            .ToListAsync(cancellationToken);

        var users = await _db.Set<AppUser>()
            .IgnoreQueryFilters()
            .Where(u => u.RootTenantId == request.TenantId)
            .AsNoTracking()
            .OrderBy(u => u.LastName)
            .ToListAsync(cancellationToken);

        var dto = new TenantDetailDto
        {
            Id = root.Id,
            Name = root.Name,
            Code = root.Code ?? string.Empty,
            IsActive = root.IsActive,
            CreatedAt = root.CreatedAt,
            Stores = stores.Select(s => new TenantStoreDto
            {
                Id = s.Id,
                Name = s.Name,
                Code = s.Code,
                IsActive = s.IsActive,
            }).ToList(),
            Users = users.Select(u => new TenantUserDto
            {
                Id = u.Id,
                Email = u.Email,
                FirstName = u.FirstName,
                LastName = u.LastName,
                IsActive = u.IsActive,
            }).ToList(),
        };

        return Result.Success(dto);
    }
}
