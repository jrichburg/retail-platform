using Microsoft.EntityFrameworkCore;
using Infrastructure.Persistence;
using Modules.Inventory.Domain.Entities;
using SharedKernel;
using SharedKernel.Application;

namespace Modules.Inventory.Application.Commands.ClosePurchaseOrder;

public class ClosePurchaseOrderCommandHandler : ICommandHandler<ClosePurchaseOrderCommand>
{
    private readonly AppDbContext _db;

    public ClosePurchaseOrderCommandHandler(AppDbContext db)
    {
        _db = db;
    }

    public async Task<Result> Handle(ClosePurchaseOrderCommand request, CancellationToken cancellationToken)
    {
        var po = await _db.Set<PurchaseOrder>()
            .FirstOrDefaultAsync(p => p.Id == request.Id, cancellationToken);

        if (po == null) return Result.Failure("Purchase order not found.");
        if (po.Status == "closed") return Result.Failure("Purchase order is already closed.");

        po.Status = "closed";
        await _db.SaveChangesAsync(cancellationToken);
        return Result.Success();
    }
}
