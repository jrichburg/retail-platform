using Microsoft.EntityFrameworkCore;
using Infrastructure.Persistence;
using Modules.Tenants.Application.Dtos;
using Modules.Tenants.Domain.Entities;
using SharedKernel;
using SharedKernel.Application;

namespace Modules.Tenants.Application.Queries.GetTenantSettings;

public class GetTenantSettingsQueryHandler : IQueryHandler<GetTenantSettingsQuery, List<TenantSettingDto>>
{
    private readonly AppDbContext _db;

    public GetTenantSettingsQueryHandler(AppDbContext db)
    {
        _db = db;
    }

    public async Task<Result<List<TenantSettingDto>>> Handle(GetTenantSettingsQuery request, CancellationToken cancellationToken)
    {
        var settings = await _db.Set<TenantSetting>()
            .AsNoTracking()
            .Where(s => s.TenantNodeId == request.TenantNodeId)
            .Select(s => new TenantSettingDto
            {
                Id = s.Id,
                TenantNodeId = s.TenantNodeId,
                SettingsKey = s.SettingsKey,
                SettingsValue = s.SettingsValue,
                IsLocked = s.IsLocked,
            })
            .ToListAsync(cancellationToken);

        return Result.Success(settings);
    }
}
