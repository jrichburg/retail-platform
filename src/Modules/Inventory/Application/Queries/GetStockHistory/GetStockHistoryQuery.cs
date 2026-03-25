using SharedKernel.Application;
using Modules.Inventory.Application.Dtos;

namespace Modules.Inventory.Application.Queries.GetStockHistory;

public record GetStockHistoryQuery(Guid ProductId, int Page = 1, int PageSize = 50) : IQuery<PagedResult<StockTransactionDto>>;
