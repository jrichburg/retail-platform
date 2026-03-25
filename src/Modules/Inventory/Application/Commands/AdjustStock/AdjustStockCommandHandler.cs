using Microsoft.EntityFrameworkCore;
using Infrastructure.Persistence;
using Modules.Inventory.Domain.Entities;
using SharedKernel;
using SharedKernel.Application;

namespace Modules.Inventory.Application.Commands.AdjustStock;

public class AdjustStockCommandHandler : ICommandHandler<AdjustStockCommand>
{
    private readonly AppDbContext _db;
    private readonly ITenantContext _tenantContext;

    public AdjustStockCommandHandler(AppDbContext db, ITenantContext tenantContext)
    {
        _db = db;
        _tenantContext = tenantContext;
    }

    public async Task<Result> Handle(AdjustStockCommand request, CancellationToken cancellationToken)
    {
        var stockLevel = await _db.Set<StockLevel>()
            .FirstOrDefaultAsync(s => s.TenantNodeId == _tenantContext.TenantNodeId && s.ProductId == request.ProductId, cancellationToken);

        if (stockLevel == null)
            return Result.Failure("No stock record found for this product at this store.");

        var newQty = stockLevel.QuantityOnHand + request.Quantity;
        if (newQty < 0)
            return Result.Failure($"Adjustment would result in negative stock ({newQty}). Current: {stockLevel.QuantityOnHand}.");

        stockLevel.QuantityOnHand = newQty;

        var transaction = new StockTransaction
        {
            TenantNodeId = _tenantContext.TenantNodeId,
            RootTenantId = _tenantContext.RootTenantId,
            ProductId = request.ProductId,
            TransactionType = "adjustment",
            Quantity = request.Quantity,
            RunningBalance = newQty,
            Notes = request.Reason,
        };
        _db.Set<StockTransaction>().Add(transaction);

        await _db.SaveChangesAsync(cancellationToken);
        return Result.Success();
    }
}
