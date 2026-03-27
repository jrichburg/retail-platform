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
            .Include(p => p.Supplier)
            .Include(p => p.SizeGrid)
            .Include(p => p.Variants)
            .Where(p => p.Id == request.Id)
            .Select(p => new ProductDto
            {
                Id = p.Id,
                Name = p.Name,
                Sku = p.Sku,
                Upc = null,
                CategoryId = p.CategoryId,
                CategoryName = p.Category.Name,
                DepartmentName = p.Category.Department.Name,
                SupplierId = p.SupplierId,
                SupplierName = p.Supplier != null ? p.Supplier.Name : null,
                Color = p.Color,
                MapDate = p.MapDate,
                SizeGridId = p.SizeGridId,
                SizeGridName = p.SizeGrid != null ? p.SizeGrid.Name : null,
                RetailPrice = p.RetailPrice,
                CostPrice = p.CostPrice,
                Description = p.Description,
                IsActive = p.IsActive,
                VariantCount = p.Variants.Count,
                Variants = p.Variants.Select(v => new ProductVariantDto
                {
                    Id = v.Id,
                    Dimension1Value = v.Dimension1Value,
                    Dimension2Value = v.Dimension2Value,
                    Upc = v.Upc,
                    IsActive = v.IsActive,
                }).ToList(),
            })
            .FirstOrDefaultAsync(cancellationToken);

        if (product == null)
            return Result.Failure<ProductDto>("Product not found.");

        return Result.Success(product);
    }
}
