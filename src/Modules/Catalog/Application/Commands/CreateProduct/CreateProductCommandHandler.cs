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

        var category = await _db.Set<Category>()
            .AnyAsync(c => c.Id == request.CategoryId, cancellationToken);

        if (!category)
            return Result.Failure<Guid>("Category not found.");

        var product = new Product
        {
            Name = request.Name,
            Sku = request.Sku,
            Upc = request.Upc,
            CategoryId = request.CategoryId,
            RetailPrice = request.RetailPrice,
            CostPrice = request.CostPrice,
            Description = request.Description,
            IsActive = true,
            TenantNodeId = _tenantContext.TenantNodeId,
            RootTenantId = _tenantContext.RootTenantId,
        };

        _db.Set<Product>().Add(product);
        await _db.SaveChangesAsync(cancellationToken);

        return Result.Success(product.Id);
    }
}
