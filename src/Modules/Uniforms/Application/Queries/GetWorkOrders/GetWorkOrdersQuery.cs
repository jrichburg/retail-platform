using SharedKernel.Application;
using Modules.Uniforms.Application.Dtos;

namespace Modules.Uniforms.Application.Queries.GetWorkOrders;

public record GetWorkOrdersQuery(int Page = 1, int PageSize = 25, string? Status = null, Guid? CustomerId = null) : IQuery<PagedResult<WorkOrderDto>>;
