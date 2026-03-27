using Microsoft.EntityFrameworkCore;
using Infrastructure.Persistence;
using Modules.Catalog.Domain.Entities;
using SharedKernel;
using SharedKernel.Application;

namespace Modules.Catalog.Application.Commands.UpdateProduct;

public class UpdateProductCommandHandler : ICommandHandler<UpdateProductCommand>
{
    private readonly AppDbContext _db;
    private readonly ITenantContext _tenantContext;

    public UpdateProductCommandHandler(AppDbContext db, ITenantContext tenantContext)
    {
        _db = db;
        _tenantContext = tenantContext;
    }

    public async Task<Result> Handle(UpdateProductCommand request, CancellationToken cancellationToken)
    {
        var product = await _db.Set<Product>()
            .Include(p => p.Variants)
            .FirstOrDefaultAsync(p => p.Id == request.Id, cancellationToken);
        if (product == null)
            return Result.Failure("Product not found.");

        if (product.Sku != request.Sku)
        {
            var skuExists = await _db.Set<Product>()
                .AnyAsync(p => p.Sku == request.Sku && p.Id != request.Id, cancellationToken);
            if (skuExists)
                return Result.Failure($"A product with SKU '{request.Sku}' already exists.");
        }

        product.Name = request.Name;
        product.Sku = request.Sku;
        product.CategoryId = request.CategoryId;
        product.SupplierId = request.SupplierId;
        product.Color = request.Color;
        product.MapDate = request.MapDate;
        product.SizeGridId = request.SizeGridId;
        product.RetailPrice = request.RetailPrice;
        product.CostPrice = request.CostPrice;
        product.Description = request.Description;
        product.IsActive = request.IsActive;

        // Upsert variants
        if (request.Variants != null)
        {
            // Remove variants not in the new list
            var existingVariants = product.Variants.ToList();
            _db.Set<ProductVariant>().RemoveRange(existingVariants);

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

        await _db.SaveChangesAsync(cancellationToken);
        return Result.Success();
    }
}
