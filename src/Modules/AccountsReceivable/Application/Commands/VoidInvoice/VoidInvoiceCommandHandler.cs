using Microsoft.EntityFrameworkCore;
using Infrastructure.Persistence;
using Modules.AccountsReceivable.Domain.Entities;
using SharedKernel;
using SharedKernel.Application;

namespace Modules.AccountsReceivable.Application.Commands.VoidInvoice;

public class VoidInvoiceCommandHandler : ICommandHandler<VoidInvoiceCommand>
{
    private readonly AppDbContext _db;

    public VoidInvoiceCommandHandler(AppDbContext db)
    {
        _db = db;
    }

    public async Task<Result> Handle(VoidInvoiceCommand request, CancellationToken cancellationToken)
    {
        var invoice = await _db.Set<Invoice>()
            .FirstOrDefaultAsync(i => i.Id == request.Id, cancellationToken);

        if (invoice == null) return Result.Failure("Invoice not found.");
        if (invoice.Status == "void") return Result.Failure("Invoice is already voided.");
        if (invoice.AmountPaid > 0) return Result.Failure("Cannot void an invoice with payments. Reverse payments first.");

        invoice.Status = "void";
        invoice.BalanceDue = 0;
        await _db.SaveChangesAsync(cancellationToken);
        return Result.Success();
    }
}
