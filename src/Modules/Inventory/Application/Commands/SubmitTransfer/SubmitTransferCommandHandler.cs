using Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;
using Modules.Inventory.Domain.Entities;
using SharedKernel;
using SharedKernel.Application;

namespace Modules.Inventory.Application.Commands.SubmitTransfer;

public class SubmitTransferCommandHandler : ICommandHandler<SubmitTransferCommand>
{
    private readonly AppDbContext _db;

    public SubmitTransferCommandHandler(AppDbContext db)
    {
        _db = db;
    }

    public async Task<Result> Handle(SubmitTransferCommand request, CancellationToken cancellationToken)
    {
        var document = await _db.Set<TransferDocument>()
            .Include(d => d.Lines)
            .FirstOrDefaultAsync(d => d.Id == request.TransferDocumentId, cancellationToken);

        if (document == null)
            return Result.Failure("Transfer document not found.");

        if (document.Status != "draft")
            return Result.Failure("Only draft transfers can be submitted.");

        // Validate stock availability at source for all lines first
        var insufficientItems = new List<string>();
        foreach (var line in document.Lines)
        {
            var stockLevel = await _db.Set<StockLevel>()
                .FirstOrDefaultAsync(s =>
                    s.TenantNodeId == document.SourceTenantNodeId &&
                    s.ProductId == line.ProductId &&
                    s.ProductVariantId == line.ProductVariantId,
                    cancellationToken);

            if (stockLevel == null || stockLevel.QuantityOnHand < line.Quantity)
            {
                var available = stockLevel?.QuantityOnHand ?? 0;
                insufficientItems.Add($"{line.ProductName} ({line.VariantDescription ?? "default"}): need {line.Quantity}, have {available}");
            }
        }

        if (insufficientItems.Any())
            return Result.Failure($"Insufficient stock: {string.Join("; ", insufficientItems)}");

        // Decrement source stock and create transfer_out transactions
        foreach (var line in document.Lines)
        {
            var stockLevel = await _db.Set<StockLevel>()
                .FirstOrDefaultAsync(s =>
                    s.TenantNodeId == document.SourceTenantNodeId &&
                    s.ProductId == line.ProductId &&
                    s.ProductVariantId == line.ProductVariantId,
                    cancellationToken);

            stockLevel!.QuantityOnHand -= line.Quantity;

            _db.Set<StockTransaction>().Add(new StockTransaction
            {
                TenantNodeId = document.SourceTenantNodeId,
                RootTenantId = document.RootTenantId,
                ProductId = line.ProductId,
                ProductVariantId = line.ProductVariantId,
                TransactionType = "transfer_out",
                Quantity = -line.Quantity,
                RunningBalance = stockLevel.QuantityOnHand,
                Reference = document.DocumentNumber,
                Notes = $"Transfer out to store: {document.DestinationTenantNodeId}",
                CreatedBy = Guid.Empty,
            });
        }

        document.Status = "in_transit";
        await _db.SaveChangesAsync(cancellationToken);

        return Result.Success();
    }
}
