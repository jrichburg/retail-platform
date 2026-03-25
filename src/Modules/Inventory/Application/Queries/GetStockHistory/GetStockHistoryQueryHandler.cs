using Microsoft.EntityFrameworkCore;
using Infrastructure.Persistence;
using Modules.Inventory.Application.Dtos;
using Modules.Inventory.Domain.Entities;
using SharedKernel;
using SharedKernel.Application;

namespace Modules.Inventory.Application.Queries.GetStockHistory;

public class GetStockHistoryQueryHandler : IQueryHandler<GetStockHistoryQuery, PagedResult<StockTransactionDto>>
{
    private readonly AppDbContext _db;

    public GetStockHistoryQueryHandler(AppDbContext db)
    {
        _db = db;
    }

    public async Task<Result<PagedResult<StockTransactionDto>>> Handle(GetStockHistoryQuery request, CancellationToken cancellationToken)
    {
        var query = _db.Set<StockTransaction>()
            .AsNoTracking()
            .Where(t => t.ProductId == request.ProductId)
            .OrderByDescending(t => t.CreatedAt);

        var totalCount = await query.CountAsync(cancellationToken);
        var items = await query
            .Skip((request.Page - 1) * request.PageSize)
            .Take(request.PageSize)
            .Select(t => new StockTransactionDto
            {
                Id = t.Id,
                ProductId = t.ProductId,
                TransactionType = t.TransactionType,
                Quantity = t.Quantity,
                RunningBalance = t.RunningBalance,
                Reference = t.Reference,
                Notes = t.Notes,
                CreatedAt = t.CreatedAt,
            })
            .ToListAsync(cancellationToken);

        return Result.Success(new PagedResult<StockTransactionDto>
        {
            Items = items,
            TotalCount = totalCount,
            Page = request.Page,
            PageSize = request.PageSize,
        });
    }
}
