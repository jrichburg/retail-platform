using Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;
using Modules.Inventory.Domain.Entities;
using SharedKernel;
using SharedKernel.Application;

namespace Modules.Inventory.Application.Commands.CancelTransfer;

public class CancelTransferCommandHandler : ICommandHandler<CancelTransferCommand>
{
    private readonly AppDbContext _db;

    public CancelTransferCommandHandler(AppDbContext db)
    {
        _db = db;
    }

    public async Task<Result> Handle(CancelTransferCommand request, CancellationToken cancellationToken)
    {
        var document = await _db.Set<TransferDocument>()
            .Include(d => d.Lines)
            .FirstOrDefaultAsync(d => d.Id == request.TransferDocumentId, cancellationToken);

        if (document == null)
            return Result.Failure("Transfer document not found.");

        if (document.Status == "completed")
            return Result.Failure("Completed transfers cannot be cancelled.");

        if (document.Status == "cancelled")
            return Result.Failure("Transfer is already cancelled.");

        // If in_transit, reverse the source stock decrements
        if (document.Status == "in_transit")
        {
            foreach (var line in document.Lines)
            {
                var stockLevel = await _db.Set<StockLevel>()
                    .FirstOrDefaultAsync(s =>
                        s.TenantNodeId == document.SourceTenantNodeId &&
                        s.ProductId == line.ProductId &&
                        s.ProductVariantId == line.ProductVariantId,
                        cancellationToken);

                if (stockLevel != null)
                {
                    stockLevel.QuantityOnHand += line.Quantity;

                    _db.Set<StockTransaction>().Add(new StockTransaction
                    {
                        TenantNodeId = document.SourceTenantNodeId,
                        RootTenantId = document.RootTenantId,
                        ProductId = line.ProductId,
                        ProductVariantId = line.ProductVariantId,
                        TransactionType = "transfer_cancelled",
                        Quantity = line.Quantity,
                        RunningBalance = stockLevel.QuantityOnHand,
                        Reference = document.DocumentNumber,
                        Notes = $"Transfer cancelled — stock restored",
                        CreatedBy = Guid.Empty,
                    });
                }
            }
        }

        document.Status = "cancelled";
        await _db.SaveChangesAsync(cancellationToken);

        return Result.Success();
    }
}
