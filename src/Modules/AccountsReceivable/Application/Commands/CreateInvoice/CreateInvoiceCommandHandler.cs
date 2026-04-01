using Microsoft.EntityFrameworkCore;
using Infrastructure.Persistence;
using Modules.AccountsReceivable.Domain.Entities;
using SharedKernel;
using SharedKernel.Application;

namespace Modules.AccountsReceivable.Application.Commands.CreateInvoice;

public class CreateInvoiceCommandHandler : ICommandHandler<CreateInvoiceCommand, Guid>
{
    private readonly AppDbContext _db;
    private readonly ITenantContext _tenantContext;

    public CreateInvoiceCommandHandler(AppDbContext db, ITenantContext tenantContext)
    {
        _db = db;
        _tenantContext = tenantContext;
    }

    public async Task<Result<Guid>> Handle(CreateInvoiceCommand request, CancellationToken cancellationToken)
    {
        var today = DateTime.UtcNow.Date;
        var todayCount = await _db.Set<Invoice>()
            .CountAsync(i => i.TenantNodeId == _tenantContext.TenantNodeId && i.CreatedAt >= today, cancellationToken);
        var invoiceNumber = $"INV-{DateTime.UtcNow:yyyyMMdd}-{(todayCount + 1):D3}";

        var invoice = new Invoice
        {
            InvoiceNumber = invoiceNumber,
            CustomerId = request.CustomerId,
            CustomerName = request.CustomerName,
            SourceType = request.SourceType,
            SourceId = request.SourceId,
            SourceReference = request.SourceReference,
            Status = "open",
            InvoiceDate = DateTime.UtcNow,
            DueDate = request.DueDate,
            Amount = request.Amount,
            AmountPaid = 0,
            BalanceDue = request.Amount,
            Notes = request.Notes,
            TenantNodeId = _tenantContext.TenantNodeId,
            RootTenantId = _tenantContext.RootTenantId,
        };

        _db.Set<Invoice>().Add(invoice);
        await _db.SaveChangesAsync(cancellationToken);

        return Result.Success(invoice.Id);
    }
}
