using Infrastructure.Persistence;
using Modules.Catalog.Domain.Entities;
using SharedKernel;
using SharedKernel.Application;

namespace Modules.Catalog.Application.Commands.CreateDepartment;

public class CreateDepartmentCommandHandler : ICommandHandler<CreateDepartmentCommand, Guid>
{
    private readonly AppDbContext _db;
    private readonly ITenantContext _tenantContext;

    public CreateDepartmentCommandHandler(AppDbContext db, ITenantContext tenantContext)
    {
        _db = db;
        _tenantContext = tenantContext;
    }

    public async Task<Result<Guid>> Handle(CreateDepartmentCommand request, CancellationToken cancellationToken)
    {
        var dept = new Department
        {
            Name = request.Name,
            SortOrder = request.SortOrder,
            IsActive = true,
            TenantNodeId = _tenantContext.TenantNodeId,
            RootTenantId = _tenantContext.RootTenantId,
        };

        _db.Set<Department>().Add(dept);
        await _db.SaveChangesAsync(cancellationToken);

        return Result.Success(dept.Id);
    }
}
