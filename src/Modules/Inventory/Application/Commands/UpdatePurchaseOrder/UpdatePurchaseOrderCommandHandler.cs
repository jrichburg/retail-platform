using Microsoft.EntityFrameworkCore;
using Infrastructure.Persistence;
using Modules.Inventory.Domain.Entities;
using SharedKernel;
using SharedKernel.Application;

namespace Modules.Inventory.Application.Commands.UpdatePurchaseOrder;

public class UpdatePurchaseOrderCommandHandler : ICommandHandler<UpdatePurchaseOrderCommand>
{
    private readonly AppDbContext _db;

    public UpdatePurchaseOrderCommandHandler(AppDbContext db)
    {
        _db = db;
    }

    public async Task<Result> Handle(UpdatePurchaseOrderCommand request, CancellationToken cancellationToken)
    {
        var po = await _db.Set<PurchaseOrder>()
            .Include(p => p.Lines)
            .FirstOrDefaultAsync(p => p.Id == request.Id, cancellationToken);

        if (po == null) return Result.Failure("Purchase order not found.");
        if (po.Status != "draft") return Result.Failure("Only draft purchase orders can be edited.");

        po.Notes = request.Notes;
        po.ExpectedDate = request.ExpectedDate;

        _db.Set<PurchaseOrderLine>().RemoveRange(po.Lines);
        po.Lines.Clear();

        decimal totalCost = 0;
        foreach (var line in request.Lines)
        {
            var lineCost = line.QuantityOrdered * line.UnitCost;
            totalCost += lineCost;
            po.Lines.Add(new PurchaseOrderLine
            {
                ProductId = line.ProductId,
                ProductVariantId = line.ProductVariantId,
                ProductName = line.ProductName,
                Sku = line.Sku,
                VariantDescription = line.VariantDescription,
                QuantityOrdered = line.QuantityOrdered,
                QuantityReceived = 0,
                UnitCost = line.UnitCost,
            });
        }
        po.TotalCost = totalCost;

        await _db.SaveChangesAsync(cancellationToken);
        return Result.Success();
    }
}
