using Microsoft.EntityFrameworkCore;
using Infrastructure.Persistence;
using Modules.Catalog.Domain.Entities;
using SharedKernel;
using SharedKernel.Application;

namespace Modules.Catalog.Application.Commands.CreateProduct;

public class CreateProductCommandHandler : ICommandHandler<CreateProductCommand, Guid>
{
    private readonly AppDbContext _db;
    private readonly ITenantContext _tenantContext;

    public CreateProductCommandHandler(AppDbContext db, ITenantContext tenantContext)
    {
        _db = db;
        _tenantContext = tenantContext;
    }

    public async Task<Result<Guid>> Handle(CreateProductCommand request, CancellationToken cancellationToken)
    {
        var skuExists = await _db.Set<Product>()
            .AnyAsync(p => p.Sku == request.Sku, cancellationToken);
        if (skuExists)
            return Result.Failure<Guid>($"A product with SKU '{request.Sku}' already exists.");

        if (!await _db.Set<Category>().AnyAsync(c => c.Id == request.CategoryId, cancellationToken))
            return Result.Failure<Guid>("Category not found.");

        if (request.SupplierId.HasValue && !await _db.Set<Supplier>().AnyAsync(s => s.Id == request.SupplierId.Value, cancellationToken))
            return Result.Failure<Guid>("Supplier not found.");

        if (request.SizeGridId.HasValue && !await _db.Set<SizeGrid>().AnyAsync(g => g.Id == request.SizeGridId.Value, cancellationToken))
            return Result.Failure<Guid>("Size grid not found.");

        var product = new Product
        {
            Name = request.Name,
            Sku = request.Sku,
            CategoryId = request.CategoryId,
            SupplierId = request.SupplierId,
            Color = request.Color,
            MapDate = request.MapDate,
            SizeGridId = request.SizeGridId,
            RetailPrice = request.RetailPrice,
            CostPrice = request.CostPrice,
            Description = request.Description,
            IsActive = true,
            TenantNodeId = _tenantContext.TenantNodeId,
            RootTenantId = _tenantContext.RootTenantId,
        };

        // Create variants
        if (request.Variants != null && request.Variants.Count > 0)
        {
            foreach (var v in request.Variants)
            {
                product.Variants.Add(new ProductVariant
                {
                    Dimension1Value = v.Dimension1Value,
                    Dimension2Value = v.Dimension2Value,
                    Upc = v.Upc,
                    IsActive = true,
                    TenantNodeId = _tenantContext.TenantNodeId,
                    RootTenantId = _tenantContext.RootTenantId,
                });
            }
        }

        _db.Set<Product>().Add(product);
        await _db.SaveChangesAsync(cancellationToken);

        return Result.Success(product.Id);
    }
}
