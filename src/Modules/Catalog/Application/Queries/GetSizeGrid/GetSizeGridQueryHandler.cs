using Microsoft.EntityFrameworkCore;
using Infrastructure.Persistence;
using Modules.Catalog.Application.Dtos;
using Modules.Catalog.Domain.Entities;
using SharedKernel;
using SharedKernel.Application;

namespace Modules.Catalog.Application.Queries.GetSizeGrid;

public class GetSizeGridQueryHandler : IQueryHandler<GetSizeGridQuery, SizeGridDto>
{
    private readonly AppDbContext _db;

    public GetSizeGridQueryHandler(AppDbContext db)
    {
        _db = db;
    }

    public async Task<Result<SizeGridDto>> Handle(GetSizeGridQuery request, CancellationToken cancellationToken)
    {
        var grid = await _db.Set<SizeGrid>()
            .AsNoTracking()
            .Include(g => g.Values.OrderBy(v => v.Dimension).ThenBy(v => v.SortOrder))
            .Where(g => g.Id == request.Id)
            .Select(g => new SizeGridDto
            {
                Id = g.Id,
                Name = g.Name,
                Dimension1Label = g.Dimension1Label,
                Dimension2Label = g.Dimension2Label,
                IsActive = g.IsActive,
                Values = g.Values.Select(v => new SizeGridValueDto
                {
                    Id = v.Id,
                    Dimension = v.Dimension,
                    Value = v.Value,
                    SortOrder = v.SortOrder,
                }).ToList(),
            })
            .FirstOrDefaultAsync(cancellationToken);

        if (grid == null)
            return Result.Failure<SizeGridDto>("Size grid not found.");

        return Result.Success(grid);
    }
}
