using SharedKernel.Application;
using Modules.Uniforms.Application.Dtos;

namespace Modules.Uniforms.Application.Queries.GetWorkOrder;

public record GetWorkOrderQuery(Guid Id) : IQuery<WorkOrderDetailDto>;
