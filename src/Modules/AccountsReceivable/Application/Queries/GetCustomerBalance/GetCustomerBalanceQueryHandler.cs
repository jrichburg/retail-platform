using Microsoft.EntityFrameworkCore;
using Infrastructure.Persistence;
using Modules.AccountsReceivable.Application.Dtos;
using Modules.AccountsReceivable.Domain.Entities;
using SharedKernel;
using SharedKernel.Application;

namespace Modules.AccountsReceivable.Application.Queries.GetCustomerBalance;

public class GetCustomerBalanceQueryHandler : IQueryHandler<GetCustomerBalanceQuery, CustomerBalanceDto>
{
    private readonly AppDbContext _db;

    public GetCustomerBalanceQueryHandler(AppDbContext db)
    {
        _db = db;
    }

    public async Task<Result<CustomerBalanceDto>> Handle(GetCustomerBalanceQuery request, CancellationToken cancellationToken)
    {
        var openInvoices = await _db.Set<Invoice>()
            .AsNoTracking()
            .Where(i => i.CustomerId == request.CustomerId && (i.Status == "open" || i.Status == "partial"))
            .OrderByDescending(i => i.DueDate)
            .Select(i => new InvoiceDto
            {
                Id = i.Id,
                InvoiceNumber = i.InvoiceNumber,
                CustomerId = i.CustomerId,
                CustomerName = i.CustomerName,
                SourceType = i.SourceType,
                SourceReference = i.SourceReference,
                Status = i.Status,
                InvoiceDate = i.InvoiceDate,
                DueDate = i.DueDate,
                Amount = i.Amount,
                AmountPaid = i.AmountPaid,
                BalanceDue = i.BalanceDue,
                PaymentCount = i.Payments.Count,
                CreatedAt = i.CreatedAt,
            })
            .ToListAsync(cancellationToken);

        var customerName = openInvoices.FirstOrDefault()?.CustomerName ?? string.Empty;

        return Result.Success(new CustomerBalanceDto
        {
            CustomerId = request.CustomerId,
            CustomerName = customerName,
            TotalBalance = openInvoices.Sum(i => i.BalanceDue),
            OpenInvoiceCount = openInvoices.Count,
            OpenInvoices = openInvoices,
        });
    }
}
