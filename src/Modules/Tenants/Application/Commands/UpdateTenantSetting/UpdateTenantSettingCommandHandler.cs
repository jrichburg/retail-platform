using Microsoft.EntityFrameworkCore;
using Infrastructure.Persistence;
using Modules.Tenants.Domain.Entities;
using SharedKernel;
using SharedKernel.Application;

namespace Modules.Tenants.Application.Commands.UpdateTenantSetting;

public class UpdateTenantSettingCommandHandler : ICommandHandler<UpdateTenantSettingCommand>
{
    private readonly AppDbContext _db;

    public UpdateTenantSettingCommandHandler(AppDbContext db)
    {
        _db = db;
    }

    public async Task<Result> Handle(UpdateTenantSettingCommand request, CancellationToken cancellationToken)
    {
        var setting = await _db.Set<TenantSetting>()
            .FirstOrDefaultAsync(s => s.TenantNodeId == request.TenantNodeId && s.SettingsKey == request.SettingsKey, cancellationToken);

        if (setting == null)
        {
            setting = new TenantSetting
            {
                TenantNodeId = request.TenantNodeId,
                SettingsKey = request.SettingsKey,
                SettingsValue = request.SettingsValue,
                IsLocked = request.IsLocked ?? false,
            };
            _db.Set<TenantSetting>().Add(setting);
        }
        else
        {
            setting.SettingsValue = request.SettingsValue;
            if (request.IsLocked.HasValue) setting.IsLocked = request.IsLocked.Value;
        }

        await _db.SaveChangesAsync(cancellationToken);
        return Result.Success();
    }
}
