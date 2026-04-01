using Microsoft.EntityFrameworkCore;
using Infrastructure.Persistence;
using Modules.AccountsReceivable.Domain.Entities;
using SharedKernel;
using SharedKernel.Application;

namespace Modules.AccountsReceivable.Application.Commands.RecordPayment;

public class RecordPaymentCommandHandler : ICommandHandler<RecordPaymentCommand, Guid>
{
    private readonly AppDbContext _db;
    private readonly ITenantContext _tenantContext;

    public RecordPaymentCommandHandler(AppDbContext db, ITenantContext tenantContext)
    {
        _db = db;
        _tenantContext = tenantContext;
    }

    public async Task<Result<Guid>> Handle(RecordPaymentCommand request, CancellationToken cancellationToken)
    {
        var invoice = await _db.Set<Invoice>()
            .FirstOrDefaultAsync(i => i.Id == request.InvoiceId, cancellationToken);

        if (invoice == null) return Result.Failure<Guid>("Invoice not found.");
        if (invoice.Status == "void") return Result.Failure<Guid>("Cannot record payment against a voided invoice.");
        if (invoice.Status == "paid") return Result.Failure<Guid>("Invoice is already fully paid.");
        if (request.Amount > invoice.BalanceDue) return Result.Failure<Guid>($"Payment amount ({request.Amount:C}) exceeds balance due ({invoice.BalanceDue:C}).");

        var today = DateTime.UtcNow.Date;
        var todayCount = await _db.Set<Payment>()
            .CountAsync(p => p.TenantNodeId == _tenantContext.TenantNodeId && p.CreatedAt >= today, cancellationToken);
        var paymentNumber = $"PMT-{DateTime.UtcNow:yyyyMMdd}-{(todayCount + 1):D3}";

        var payment = new Payment
        {
            PaymentNumber = paymentNumber,
            InvoiceId = invoice.Id,
            CustomerId = invoice.CustomerId,
            Amount = request.Amount,
            PaymentMethod = request.PaymentMethod,
            PaymentDate = request.PaymentDate,
            Reference = request.Reference,
            Notes = request.Notes,
            TenantNodeId = _tenantContext.TenantNodeId,
            RootTenantId = _tenantContext.RootTenantId,
        };

        invoice.AmountPaid += request.Amount;
        invoice.BalanceDue -= request.Amount;
        invoice.Status = invoice.BalanceDue == 0 ? "paid" : "partial";

        _db.Set<Payment>().Add(payment);
        await _db.SaveChangesAsync(cancellationToken);

        return Result.Success(payment.Id);
    }
}
