using SharedKernel.Application;
using Modules.Sales.Application.Dtos;

namespace Modules.Sales.Application.Queries.GetSales;

public record GetSalesQuery(int Page = 1, int PageSize = 25, DateTime? From = null, DateTime? To = null, string? Status = null) : IQuery<PagedResult<SaleDto>>;
