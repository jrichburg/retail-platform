using Microsoft.EntityFrameworkCore;
using Infrastructure.Persistence;
using Modules.AccountsReceivable.Application.Dtos;
using Modules.AccountsReceivable.Domain.Entities;
using SharedKernel;
using SharedKernel.Application;

namespace Modules.AccountsReceivable.Application.Queries.GetInvoices;

public class GetInvoicesQueryHandler : IQueryHandler<GetInvoicesQuery, PagedResult<InvoiceDto>>
{
    private readonly AppDbContext _db;

    public GetInvoicesQueryHandler(AppDbContext db)
    {
        _db = db;
    }

    public async Task<Result<PagedResult<InvoiceDto>>> Handle(GetInvoicesQuery request, CancellationToken cancellationToken)
    {
        var query = _db.Set<Invoice>()
            .AsNoTracking()
            .Include(i => i.Payments)
            .AsQueryable();

        if (!string.IsNullOrWhiteSpace(request.Status))
            query = query.Where(i => i.Status == request.Status);
        if (request.CustomerId.HasValue)
            query = query.Where(i => i.CustomerId == request.CustomerId.Value);

        var totalCount = await query.CountAsync(cancellationToken);
        var items = await query
            .OrderByDescending(i => i.CreatedAt)
            .Skip((request.Page - 1) * request.PageSize)
            .Take(request.PageSize)
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

        return Result.Success(new PagedResult<InvoiceDto>
        {
            Items = items,
            TotalCount = totalCount,
            Page = request.Page,
            PageSize = request.PageSize,
        });
    }
}
