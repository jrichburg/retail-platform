using Microsoft.EntityFrameworkCore;
using Infrastructure.Persistence;
using Modules.Catalog.Domain.Entities;
using SharedKernel;
using SharedKernel.Application;

namespace Modules.Catalog.Application.Commands.CreateCategory;

public class CreateCategoryCommandHandler : ICommandHandler<CreateCategoryCommand, Guid>
{
    private readonly AppDbContext _db;
    private readonly ITenantContext _tenantContext;

    public CreateCategoryCommandHandler(AppDbContext db, ITenantContext tenantContext)
    {
        _db = db;
        _tenantContext = tenantContext;
    }

    public async Task<Result<Guid>> Handle(CreateCategoryCommand request, CancellationToken cancellationToken)
    {
        var deptExists = await _db.Set<Department>()
            .AnyAsync(d => d.Id == request.DepartmentId, cancellationToken);

        if (!deptExists)
            return Result.Failure<Guid>("Department not found.");

        var category = new Category
        {
            DepartmentId = request.DepartmentId,
            Name = request.Name,
            SortOrder = request.SortOrder,
            IsActive = true,
            TenantNodeId = _tenantContext.TenantNodeId,
            RootTenantId = _tenantContext.RootTenantId,
        };

        _db.Set<Category>().Add(category);
        await _db.SaveChangesAsync(cancellationToken);

        return Result.Success(category.Id);
    }
}
