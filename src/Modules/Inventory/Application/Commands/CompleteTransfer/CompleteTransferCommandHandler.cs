using Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;
using Modules.Inventory.Domain.Entities;
using SharedKernel;
using SharedKernel.Application;

namespace Modules.Inventory.Application.Commands.CompleteTransfer;

public class CompleteTransferCommandHandler : ICommandHandler<CompleteTransferCommand>
{
    private readonly AppDbContext _db;

    public CompleteTransferCommandHandler(AppDbContext db)
    {
        _db = db;
    }

    public async Task<Result> Handle(CompleteTransferCommand request, CancellationToken cancellationToken)
    {
        var document = await _db.Set<TransferDocument>()
            .Include(d => d.Lines)
            .FirstOrDefaultAsync(d => d.Id == request.TransferDocumentId, cancellationToken);

        if (document == null)
            return Result.Failure("Transfer document not found.");

        if (document.Status != "in_transit")
            return Result.Failure("Only in-transit transfers can be completed.");

        // Upsert stock at destination and create transfer_in transactions
        foreach (var line in document.Lines)
        {
            var stockLevel = await _db.Set<StockLevel>()
                .FirstOrDefaultAsync(s =>
                    s.TenantNodeId == document.DestinationTenantNodeId &&
                    s.ProductId == line.ProductId &&
                    s.ProductVariantId == line.ProductVariantId,
                    cancellationToken);

            if (stockLevel == null)
            {
                stockLevel = new StockLevel
                {
                    TenantNodeId = document.DestinationTenantNodeId,
                    RootTenantId = document.RootTenantId,
                    ProductId = line.ProductId,
                    ProductVariantId = line.ProductVariantId,
                    QuantityOnHand = line.Quantity,
                };
                _db.Set<StockLevel>().Add(stockLevel);
            }
            else
            {
                stockLevel.QuantityOnHand += line.Quantity;
            }

            _db.Set<StockTransaction>().Add(new StockTransaction
            {
                TenantNodeId = document.DestinationTenantNodeId,
                RootTenantId = document.RootTenantId,
                ProductId = line.ProductId,
                ProductVariantId = line.ProductVariantId,
                TransactionType = "transfer_in",
                Quantity = line.Quantity,
                RunningBalance = stockLevel.QuantityOnHand,
                Reference = document.DocumentNumber,
                Notes = $"Transfer in from store: {document.SourceTenantNodeId}",
                CreatedBy = Guid.Empty,
            });
        }

        document.Status = "completed";
        await _db.SaveChangesAsync(cancellationToken);

        return Result.Success();
    }
}
