using Microsoft.EntityFrameworkCore;
using Infrastructure.Persistence;
using Modules.Catalog.Domain.Entities;
using SharedKernel;
using SharedKernel.Application;

namespace Modules.Catalog.Application.Commands.UpdateSizeGrid;

public class UpdateSizeGridCommandHandler : ICommandHandler<UpdateSizeGridCommand>
{
    private readonly AppDbContext _db;

    public UpdateSizeGridCommandHandler(AppDbContext db)
    {
        _db = db;
    }

    public async Task<Result> Handle(UpdateSizeGridCommand request, CancellationToken cancellationToken)
    {
        var grid = await _db.Set<SizeGrid>()
            .Include(g => g.Values)
            .FirstOrDefaultAsync(g => g.Id == request.Id, cancellationToken);

        if (grid == null)
            return Result.Failure("Size grid not found.");

        if (grid.Name != request.Name)
        {
            var nameExists = await _db.Set<SizeGrid>()
                .AnyAsync(g => g.Name == request.Name && g.Id != request.Id, cancellationToken);
            if (nameExists)
                return Result.Failure($"A size grid named '{request.Name}' already exists.");
        }

        grid.Name = request.Name;
        grid.Dimension1Label = request.Dimension1Label;
        grid.Dimension2Label = request.Dimension2Label;
        grid.IsActive = request.IsActive;

        // Full replace of values
        _db.Set<SizeGridValue>().RemoveRange(grid.Values);
        foreach (var v in request.Values)
        {
            grid.Values.Add(new SizeGridValue
            {
                Dimension = v.Dimension,
                Value = v.Value,
                SortOrder = v.SortOrder,
            });
        }

        await _db.SaveChangesAsync(cancellationToken);
        return Result.Success();
    }
}
