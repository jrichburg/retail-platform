using Microsoft.EntityFrameworkCore;
using Infrastructure.Persistence;
using Modules.AccountsReceivable.Application.Dtos;
using Modules.AccountsReceivable.Domain.Entities;
using SharedKernel;
using SharedKernel.Application;

namespace Modules.AccountsReceivable.Application.Queries.GetInvoice;

public class GetInvoiceQueryHandler : IQueryHandler<GetInvoiceQuery, InvoiceDetailDto>
{
    private readonly AppDbContext _db;

    public GetInvoiceQueryHandler(AppDbContext db)
    {
        _db = db;
    }

    public async Task<Result<InvoiceDetailDto>> Handle(GetInvoiceQuery request, CancellationToken cancellationToken)
    {
        var invoice = await _db.Set<Invoice>()
            .AsNoTracking()
            .Include(i => i.Payments)
            .Where(i => i.Id == request.Id)
            .Select(i => new InvoiceDetailDto
            {
                Id = i.Id,
                InvoiceNumber = i.InvoiceNumber,
                CustomerId = i.CustomerId,
                CustomerName = i.CustomerName,
                SourceType = i.SourceType,
                SourceId = i.SourceId,
                SourceReference = i.SourceReference,
                Status = i.Status,
                InvoiceDate = i.InvoiceDate,
                DueDate = i.DueDate,
                Amount = i.Amount,
                AmountPaid = i.AmountPaid,
                BalanceDue = i.BalanceDue,
                Notes = i.Notes,
                CreatedAt = i.CreatedAt,
                Payments = i.Payments.OrderByDescending(p => p.PaymentDate).Select(p => new PaymentDto
                {
                    Id = p.Id,
                    PaymentNumber = p.PaymentNumber,
                    InvoiceId = p.InvoiceId,
                    CustomerId = p.CustomerId,
                    Amount = p.Amount,
                    PaymentMethod = p.PaymentMethod,
                    PaymentDate = p.PaymentDate,
                    Reference = p.Reference,
                    Notes = p.Notes,
                    CreatedAt = p.CreatedAt,
                }).ToList(),
            })
            .FirstOrDefaultAsync(cancellationToken);

        if (invoice == null) return Result.Failure<InvoiceDetailDto>("Invoice not found.");
        return Result.Success(invoice);
    }
}
