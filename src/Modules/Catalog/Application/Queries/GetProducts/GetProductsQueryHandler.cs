using Microsoft.EntityFrameworkCore;
using Infrastructure.Persistence;
using Modules.Catalog.Application.Dtos;
using Modules.Catalog.Domain.Entities;
using SharedKernel;
using SharedKernel.Application;

namespace Modules.Catalog.Application.Queries.GetProducts;

public class GetProductsQueryHandler : IQueryHandler<GetProductsQuery, PagedResult<ProductDto>>
{
    private readonly AppDbContext _db;

    public GetProductsQueryHandler(AppDbContext db)
    {
        _db = db;
    }

    public async Task<Result<PagedResult<ProductDto>>> Handle(GetProductsQuery request, CancellationToken cancellationToken)
    {
        var query = _db.Set<Product>()
            .AsNoTracking()
            .Include(p => p.Category)
                .ThenInclude(c => c.Department)
            .AsQueryable();

        if (!string.IsNullOrWhiteSpace(request.Search))
        {
            var search = request.Search.ToLower();
            query = query.Where(p =>
                p.Name.ToLower().Contains(search) ||
                p.Sku.ToLower().Contains(search) ||
                (p.Upc != null && p.Upc.Contains(search)));
        }

        if (request.CategoryId.HasValue)
            query = query.Where(p => p.CategoryId == request.CategoryId.Value);

        if (request.IsActive.HasValue)
            query = query.Where(p => p.IsActive == request.IsActive.Value);

        var totalCount = await query.CountAsync(cancellationToken);

        var items = await query
            .OrderBy(p => p.Name)
            .Skip((request.Page - 1) * request.PageSize)
            .Take(request.PageSize)
            .Select(p => new ProductDto
            {
                Id = p.Id,
                Name = p.Name,
                Sku = p.Sku,
                Upc = p.Upc,
                CategoryId = p.CategoryId,
                CategoryName = p.Category.Name,
                DepartmentName = p.Category.Department.Name,
                RetailPrice = p.RetailPrice,
                CostPrice = p.CostPrice,
                Description = p.Description,
                IsActive = p.IsActive,
            })
            .ToListAsync(cancellationToken);

        return Result.Success(new PagedResult<ProductDto>
        {
            Items = items,
            TotalCount = totalCount,
            Page = request.Page,
            PageSize = request.PageSize,
        });
    }
}
