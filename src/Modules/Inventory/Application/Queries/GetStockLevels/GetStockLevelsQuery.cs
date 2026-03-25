using SharedKernel.Application;
using Modules.Inventory.Application.Dtos;

namespace Modules.Inventory.Application.Queries.GetStockLevels;

public record GetStockLevelsQuery(int Page = 1, int PageSize = 25, string? Search = null) : IQuery<PagedResult<StockLevelDto>>;
