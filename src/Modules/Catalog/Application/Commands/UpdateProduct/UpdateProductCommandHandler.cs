using Microsoft.EntityFrameworkCore;
using Infrastructure.Persistence;
using Modules.Catalog.Domain.Entities;
using SharedKernel;
using SharedKernel.Application;

namespace Modules.Catalog.Application.Commands.UpdateProduct;

public class UpdateProductCommandHandler : ICommandHandler<UpdateProductCommand>
{
    private readonly AppDbContext _db;

    public UpdateProductCommandHandler(AppDbContext db)
    {
        _db = db;
    }

    public async Task<Result> Handle(UpdateProductCommand request, CancellationToken cancellationToken)
    {
        var product = await _db.Set<Product>()
            .FirstOrDefaultAsync(p => p.Id == request.Id, cancellationToken);

        if (product == null)
            return Result.Failure("Product not found.");

        // Check SKU uniqueness if changed
        if (product.Sku != request.Sku)
        {
            var skuExists = await _db.Set<Product>()
                .AnyAsync(p => p.Sku == request.Sku && p.Id != request.Id, cancellationToken);
            if (skuExists)
                return Result.Failure($"A product with SKU '{request.Sku}' already exists.");
        }

        product.Name = request.Name;
        product.Sku = request.Sku;
        product.Upc = request.Upc;
        product.CategoryId = request.CategoryId;
        product.RetailPrice = request.RetailPrice;
        product.CostPrice = request.CostPrice;
        product.Description = request.Description;
        product.IsActive = request.IsActive;

        await _db.SaveChangesAsync(cancellationToken);
        return Result.Success();
    }
}
