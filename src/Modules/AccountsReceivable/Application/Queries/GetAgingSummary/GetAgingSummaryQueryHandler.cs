using Microsoft.EntityFrameworkCore;
using Infrastructure.Persistence;
using Modules.AccountsReceivable.Application.Dtos;
using Modules.AccountsReceivable.Domain.Entities;
using SharedKernel;
using SharedKernel.Application;

namespace Modules.AccountsReceivable.Application.Queries.GetAgingSummary;

public class GetAgingSummaryQueryHandler : IQueryHandler<GetAgingSummaryQuery, AgingSummaryDto>
{
    private readonly AppDbContext _db;

    public GetAgingSummaryQueryHandler(AppDbContext db)
    {
        _db = db;
    }

    public async Task<Result<AgingSummaryDto>> Handle(GetAgingSummaryQuery request, CancellationToken cancellationToken)
    {
        var today = DateTime.UtcNow.Date;
        var invoices = await _db.Set<Invoice>()
            .AsNoTracking()
            .Where(i => i.Status == "open" || i.Status == "partial")
            .Select(i => new { i.CustomerId, i.CustomerName, i.DueDate, i.BalanceDue })
            .ToListAsync(cancellationToken);

        var customers = invoices
            .GroupBy(i => new { i.CustomerId, i.CustomerName })
            .Select(g =>
            {
                var current = g.Where(i => i.DueDate >= today).Sum(i => i.BalanceDue);
                var thirtyDays = g.Where(i => i.DueDate < today && i.DueDate >= today.AddDays(-30)).Sum(i => i.BalanceDue);
                var sixtyDays = g.Where(i => i.DueDate < today.AddDays(-30) && i.DueDate >= today.AddDays(-60)).Sum(i => i.BalanceDue);
                var ninetyPlus = g.Where(i => i.DueDate < today.AddDays(-60)).Sum(i => i.BalanceDue);

                return new AgingCustomerDto
                {
                    CustomerId = g.Key.CustomerId,
                    CustomerName = g.Key.CustomerName,
                    Current = current,
                    ThirtyDays = thirtyDays,
                    SixtyDays = sixtyDays,
                    NinetyPlus = ninetyPlus,
                    TotalBalance = current + thirtyDays + sixtyDays + ninetyPlus,
                };
            })
            .Where(c => c.TotalBalance > 0)
            .OrderByDescending(c => c.TotalBalance)
            .ToList();

        return Result.Success(new AgingSummaryDto
        {
            Current = customers.Sum(c => c.Current),
            ThirtyDays = customers.Sum(c => c.ThirtyDays),
            SixtyDays = customers.Sum(c => c.SixtyDays),
            NinetyPlus = customers.Sum(c => c.NinetyPlus),
            TotalOutstanding = customers.Sum(c => c.TotalBalance),
            Customers = customers,
        });
    }
}
