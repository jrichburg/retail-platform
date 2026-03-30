using SharedKernel.Application;
using Modules.Inventory.Application.Dtos;

namespace Modules.Inventory.Application.Queries.GetPurchaseOrder;

public record GetPurchaseOrderQuery(Guid Id) : IQuery<PurchaseOrderDetailDto>;
