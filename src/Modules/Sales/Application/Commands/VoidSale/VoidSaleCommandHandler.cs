using Microsoft.EntityFrameworkCore;
using Infrastructure.Persistence;
using Modules.Sales.Domain.Entities;
using SharedKernel;
using SharedKernel.Application;

namespace Modules.Sales.Application.Commands.VoidSale;

public class VoidSaleCommandHandler : ICommandHandler<VoidSaleCommand>
{
    private readonly AppDbContext _db;

    public VoidSaleCommandHandler(AppDbContext db)
    {
        _db = db;
    }

    public async Task<Result> Handle(VoidSaleCommand request, CancellationToken cancellationToken)
    {
        var sale = await _db.Set<Sale>()
            .FirstOrDefaultAsync(s => s.Id == request.SaleId, cancellationToken);

        if (sale == null)
            return Result.Failure("Sale not found.");

        if (sale.Status == "voided")
            return Result.Failure("Sale is already voided.");

        sale.Status = "voided";
        await _db.SaveChangesAsync(cancellationToken);
        return Result.Success();
    }
}
