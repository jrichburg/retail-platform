using Microsoft.EntityFrameworkCore;
using Infrastructure.Persistence;
using Modules.Inventory.Domain.Entities;
using SharedKernel;
using SharedKernel.Application;

namespace Modules.Inventory.Application.Commands.DecrementStock;

public class DecrementStockCommandHandler : ICommandHandler<DecrementStockCommand>
{
    private readonly AppDbContext _db;

    public DecrementStockCommandHandler(AppDbContext db)
    {
        _db = db;
    }

    public async Task<Result> Handle(DecrementStockCommand request, CancellationToken cancellationToken)
    {
        var stockLevel = await _db.Set<StockLevel>()
            .FirstOrDefaultAsync(s => s.TenantNodeId == request.TenantNodeId && s.ProductId == request.ProductId, cancellationToken);

        if (stockLevel == null)
            return Result.Failure($"No stock record found for product {request.ProductId}.");

        stockLevel.QuantityOnHand -= request.Quantity;

        var transaction = new StockTransaction
        {
            TenantNodeId = request.TenantNodeId,
            RootTenantId = request.RootTenantId,
            ProductId = request.ProductId,
            ProductVariantId = request.ProductVariantId,
            TransactionType = "sale",
            Quantity = -request.Quantity,
            RunningBalance = stockLevel.QuantityOnHand,
            Reference = request.SaleId.ToString(),
        };
        _db.Set<StockTransaction>().Add(transaction);

        await _db.SaveChangesAsync(cancellationToken);
        return Result.Success();
    }
}
