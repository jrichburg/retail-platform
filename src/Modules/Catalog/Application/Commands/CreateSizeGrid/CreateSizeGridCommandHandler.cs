using Microsoft.EntityFrameworkCore;
using Infrastructure.Persistence;
using Modules.Catalog.Domain.Entities;
using SharedKernel;
using SharedKernel.Application;

namespace Modules.Catalog.Application.Commands.CreateSizeGrid;

public class CreateSizeGridCommandHandler : ICommandHandler<CreateSizeGridCommand, Guid>
{
    private readonly AppDbContext _db;
    private readonly ITenantContext _tenantContext;

    public CreateSizeGridCommandHandler(AppDbContext db, ITenantContext tenantContext)
    {
        _db = db;
        _tenantContext = tenantContext;
    }

    public async Task<Result<Guid>> Handle(CreateSizeGridCommand request, CancellationToken cancellationToken)
    {
        var nameExists = await _db.Set<SizeGrid>()
            .AnyAsync(g => g.Name == request.Name, cancellationToken);
        if (nameExists)
            return Result.Failure<Guid>($"A size grid named '{request.Name}' already exists.");

        var grid = new SizeGrid
        {
            Name = request.Name,
            Dimension1Label = request.Dimension1Label,
            Dimension2Label = request.Dimension2Label,
            IsActive = true,
            TenantNodeId = _tenantContext.TenantNodeId,
            RootTenantId = _tenantContext.RootTenantId,
        };

        foreach (var v in request.Values)
        {
            grid.Values.Add(new SizeGridValue
            {
                Dimension = v.Dimension,
                Value = v.Value,
                SortOrder = v.SortOrder,
            });
        }

        _db.Set<SizeGrid>().Add(grid);
        await _db.SaveChangesAsync(cancellationToken);

        return Result.Success(grid.Id);
    }
}
