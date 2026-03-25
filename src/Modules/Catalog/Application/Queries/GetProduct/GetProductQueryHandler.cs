using Microsoft.EntityFrameworkCore;
using Infrastructure.Persistence;
using Modules.Catalog.Application.Dtos;
using Modules.Catalog.Domain.Entities;
using SharedKernel;
using SharedKernel.Application;

namespace Modules.Catalog.Application.Queries.GetProduct;

public class GetProductQueryHandler : IQueryHandler<GetProductQuery, ProductDto>
{
    private readonly AppDbContext _db;

    public GetProductQueryHandler(AppDbContext db)
    {
        _db = db;
    }

    public async Task<Result<ProductDto>> Handle(GetProductQuery request, CancellationToken cancellationToken)
    {
        var product = await _db.Set<Product>()
            .AsNoTracking()
            .Include(p => p.Category)
                .ThenInclude(c => c.Department)
            .Where(p => p.Id == request.Id)
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
            .FirstOrDefaultAsync(cancellationToken);

        if (product == null)
            return Result.Failure<ProductDto>("Product not found.");

        return Result.Success(product);
    }
}
