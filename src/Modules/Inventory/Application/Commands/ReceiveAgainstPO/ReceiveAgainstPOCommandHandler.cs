using Microsoft.EntityFrameworkCore;
using Infrastructure.Persistence;
using Modules.Inventory.Domain.Entities;
using SharedKernel;
using SharedKernel.Application;

namespace Modules.Inventory.Application.Commands.ReceiveAgainstPO;

public class ReceiveAgainstPOCommandHandler : ICommandHandler<ReceiveAgainstPOCommand, Guid>
{
    private readonly AppDbContext _db;
    private readonly ITenantContext _tenantContext;

    public ReceiveAgainstPOCommandHandler(AppDbContext db, ITenantContext tenantContext)
    {
        _db = db;
        _tenantContext = tenantContext;
    }

    public async Task<Result<Guid>> Handle(ReceiveAgainstPOCommand request, CancellationToken cancellationToken)
    {
        var po = await _db.Set<PurchaseOrder>()
            .Include(p => p.Lines)
            .FirstOrDefaultAsync(p => p.Id == request.PurchaseOrderId, cancellationToken);

        if (po == null) return Result.Failure<Guid>("Purchase order not found.");
        if (po.Status != "submitted" && po.Status != "partially_received")
            return Result.Failure<Guid>("Purchase order is not in a receivable status.");

        // Generate document number
        var today = DateTime.UtcNow.Date;
        var todayCount = await _db.Set<ReceiveDocument>()
            .CountAsync(d => d.TenantNodeId == _tenantContext.TenantNodeId && d.CreatedAt >= today, cancellationToken);
        var docNumber = $"RCV-{DateTime.UtcNow:yyyyMMdd}-{(todayCount + 1):D3}";

        var document = new ReceiveDocument
        {
            DocumentNumber = docNumber,
            PurchaseOrderId = po.Id,
            Status = "completed",
            Notes = request.Notes,
            TenantNodeId = _tenantContext.TenantNodeId,
            RootTenantId = _tenantContext.RootTenantId,
        };

        foreach (var line in request.Lines)
        {
            document.Lines.Add(new ReceiveDocumentLine
            {
                ProductId = line.ProductId,
                ProductVariantId = line.ProductVariantId,
                ProductName = line.ProductName,
                Sku = line.Sku,
                Upc = line.Upc,
                VariantDescription = line.VariantDescription,
                Quantity = line.Quantity,
            });

            // Update stock level
            var stockLevel = await _db.Set<StockLevel>()
                .FirstOrDefaultAsync(s =>
                    s.TenantNodeId == _tenantContext.TenantNodeId &&
                    s.ProductId == line.ProductId &&
                    s.ProductVariantId == line.ProductVariantId,
                    cancellationToken);

            if (stockLevel == null)
            {
                stockLevel = new StockLevel
                {
                    TenantNodeId = _tenantContext.TenantNodeId,
                    RootTenantId = _tenantContext.RootTenantId,
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
                TenantNodeId = _tenantContext.TenantNodeId,
                RootTenantId = _tenantContext.RootTenantId,
                ProductId = line.ProductId,
                ProductVariantId = line.ProductVariantId,
                TransactionType = "received",
                Quantity = line.Quantity,
                RunningBalance = stockLevel.QuantityOnHand,
                Reference = $"{docNumber} (PO: {po.OrderNumber})",
            });

            // Update PO line received quantity
            var poLine = po.Lines.FirstOrDefault(l =>
                l.ProductId == line.ProductId &&
                l.ProductVariantId == line.ProductVariantId);

            if (poLine != null)
            {
                poLine.QuantityReceived += line.Quantity;
            }
        }

        // Determine PO status
        var allFullyReceived = po.Lines.All(l => l.QuantityReceived >= l.QuantityOrdered);
        var anyReceived = po.Lines.Any(l => l.QuantityReceived > 0);

        if (allFullyReceived)
            po.Status = "fully_received";
        else if (anyReceived)
            po.Status = "partially_received";

        _db.Set<ReceiveDocument>().Add(document);
        await _db.SaveChangesAsync(cancellationToken);

        return Result.Success(document.Id);
    }
}
