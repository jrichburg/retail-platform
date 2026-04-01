using Microsoft.EntityFrameworkCore;
using Infrastructure.Persistence;
using Modules.AccountsReceivable.Application.Dtos;
using Modules.AccountsReceivable.Domain.Entities;
using SharedKernel;
using SharedKernel.Application;

namespace Modules.AccountsReceivable.Application.Queries.GetPayments;

public class GetPaymentsQueryHandler : IQueryHandler<GetPaymentsQuery, PagedResult<PaymentDto>>
{
    private readonly AppDbContext _db;

    public GetPaymentsQueryHandler(AppDbContext db)
    {
        _db = db;
    }

    public async Task<Result<PagedResult<PaymentDto>>> Handle(GetPaymentsQuery request, CancellationToken cancellationToken)
    {
        var query = _db.Set<Payment>()
            .AsNoTracking()
            .AsQueryable();

        if (request.CustomerId.HasValue)
            query = query.Where(p => p.CustomerId == request.CustomerId.Value);
        if (request.InvoiceId.HasValue)
            query = query.Where(p => p.InvoiceId == request.InvoiceId.Value);

        var totalCount = await query.CountAsync(cancellationToken);
        var items = await query
            .OrderByDescending(p => p.PaymentDate)
            .Skip((request.Page - 1) * request.PageSize)
            .Take(request.PageSize)
            .Select(p => new PaymentDto
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
            })
            .ToListAsync(cancellationToken);

        return Result.Success(new PagedResult<PaymentDto>
        {
            Items = items,
            TotalCount = totalCount,
            Page = request.Page,
            PageSize = request.PageSize,
        });
    }
}
