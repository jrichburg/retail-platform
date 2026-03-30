using Microsoft.EntityFrameworkCore;
using Infrastructure.Persistence;
using Modules.Inventory.Domain.Entities;
using SharedKernel;
using SharedKernel.Application;

namespace Modules.Inventory.Application.Commands.SubmitPurchaseOrder;

public class SubmitPurchaseOrderCommandHandler : ICommandHandler<SubmitPurchaseOrderCommand>
{
    private readonly AppDbContext _db;

    public SubmitPurchaseOrderCommandHandler(AppDbContext db)
    {
        _db = db;
    }

    public async Task<Result> Handle(SubmitPurchaseOrderCommand request, CancellationToken cancellationToken)
    {
        var po = await _db.Set<PurchaseOrder>()
            .FirstOrDefaultAsync(p => p.Id == request.Id, cancellationToken);

        if (po == null) return Result.Failure("Purchase order not found.");
        if (po.Status != "draft") return Result.Failure("Only draft purchase orders can be submitted.");

        po.Status = "submitted";
        await _db.SaveChangesAsync(cancellationToken);
        return Result.Success();
    }
}
