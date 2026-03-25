using Microsoft.EntityFrameworkCore;
using Infrastructure.Persistence;
using Modules.Inventory.Domain.Entities;
using SharedKernel;
using SharedKernel.Application;

namespace Modules.Inventory.Application.Commands.ReceiveStock;

public class ReceiveStockCommandHandler : ICommandHandler<ReceiveStockCommand>
{
    private readonly AppDbContext _db;
    private readonly ITenantContext _tenantContext;

    public ReceiveStockCommandHandler(AppDbContext db, ITenantContext tenantContext)
    {
        _db = db;
        _tenantContext = tenantContext;
    }

    public async Task<Result> Handle(ReceiveStockCommand request, CancellationToken cancellationToken)
    {
        var stockLevel = await _db.Set<StockLevel>()
            .FirstOrDefaultAsync(s => s.TenantNodeId == _tenantContext.TenantNodeId && s.ProductId == request.ProductId, cancellationToken);

        if (stockLevel == null)
        {
            stockLevel = new StockLevel
            {
                TenantNodeId = _tenantContext.TenantNodeId,
                RootTenantId = _tenantContext.RootTenantId,
                ProductId = request.ProductId,
                QuantityOnHand = request.Quantity,
            };
            _db.Set<StockLevel>().Add(stockLevel);
        }
        else
        {
            stockLevel.QuantityOnHand += request.Quantity;
        }

        var transaction = new StockTransaction
        {
            TenantNodeId = _tenantContext.TenantNodeId,
            RootTenantId = _tenantContext.RootTenantId,
            ProductId = request.ProductId,
            TransactionType = "received",
            Quantity = request.Quantity,
            RunningBalance = stockLevel.QuantityOnHand,
            Reference = request.Reference,
            Notes = request.Notes,
        };
        _db.Set<StockTransaction>().Add(transaction);

        await _db.SaveChangesAsync(cancellationToken);
        return Result.Success();
    }
}
