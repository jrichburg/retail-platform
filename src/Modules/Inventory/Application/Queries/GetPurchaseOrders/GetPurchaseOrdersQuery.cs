using SharedKernel.Application;
using Modules.Inventory.Application.Dtos;

namespace Modules.Inventory.Application.Queries.GetPurchaseOrders;

public record GetPurchaseOrdersQuery(int Page = 1, int PageSize = 25, string? Status = null, Guid? SupplierId = null) : IQuery<PagedResult<PurchaseOrderDto>>;
