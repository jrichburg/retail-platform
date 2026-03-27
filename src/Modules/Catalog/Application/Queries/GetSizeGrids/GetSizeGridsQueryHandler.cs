using Microsoft.EntityFrameworkCore;
using Infrastructure.Persistence;
using Modules.Catalog.Application.Dtos;
using Modules.Catalog.Domain.Entities;
using SharedKernel;
using SharedKernel.Application;

namespace Modules.Catalog.Application.Queries.GetSizeGrids;

public class GetSizeGridsQueryHandler : IQueryHandler<GetSizeGridsQuery, List<SizeGridDto>>
{
    private readonly AppDbContext _db;

    public GetSizeGridsQueryHandler(AppDbContext db)
    {
        _db = db;
    }

    public async Task<Result<List<SizeGridDto>>> Handle(GetSizeGridsQuery request, CancellationToken cancellationToken)
    {
        var grids = await _db.Set<SizeGrid>()
            .AsNoTracking()
            .Include(g => g.Values.OrderBy(v => v.Dimension).ThenBy(v => v.SortOrder))
            .OrderBy(g => g.Name)
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
            .ToListAsync(cancellationToken);

        return Result.Success(grids);
    }
}
