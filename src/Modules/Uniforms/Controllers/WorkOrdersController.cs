using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Modules.Uniforms.Application.Commands.CompleteWorkOrder;
using Modules.Uniforms.Application.Commands.CreateWorkOrder;
using Modules.Uniforms.Application.Commands.PickupWorkOrder;
using Modules.Uniforms.Application.Commands.StartWorkOrder;
using Modules.Uniforms.Application.Commands.SubmitWorkOrder;
using Modules.Uniforms.Application.Commands.UpdateWorkOrder;
using Modules.Uniforms.Application.Queries.GetWorkOrder;
using Modules.Uniforms.Application.Queries.GetWorkOrders;

namespace Modules.Uniforms.Controllers;

[ApiController]
[Route("api/v1/work-orders")]
[Authorize]
public class WorkOrdersController : ControllerBase
{
    private readonly IMediator _mediator;

    public WorkOrdersController(IMediator mediator)
    {
        _mediator = mediator;
    }

    [HttpGet]
    public async Task<IActionResult> GetWorkOrders([FromQuery] int page = 1, [FromQuery] int pageSize = 25, [FromQuery] string? status = null, [FromQuery] Guid? customerId = null)
    {
        var result = await _mediator.Send(new GetWorkOrdersQuery(page, pageSize, status, customerId));
        return result.IsSuccess ? Ok(result.Value) : BadRequest(new { message = result.Error });
    }

    [HttpGet("{id:guid}")]
    public async Task<IActionResult> GetWorkOrder(Guid id)
    {
        var result = await _mediator.Send(new GetWorkOrderQuery(id));
        return result.IsSuccess ? Ok(result.Value) : NotFound(new { message = result.Error });
    }

    [HttpPost]
    public async Task<IActionResult> CreateWorkOrder([FromBody] CreateWorkOrderRequest request)
    {
        var lines = request.Lines.Select(l => new WorkOrderLineInput(
            l.Description, l.ProductVariantId, l.ProductName, l.Sku, l.Quantity, l.UnitPrice
        )).ToList();
        var result = await _mediator.Send(new CreateWorkOrderCommand(
            request.CustomerId, request.CustomerName, request.CustomerPhone, request.CustomerEmail,
            request.DueDate, request.Notes, lines));
        return result.IsSuccess ? Created($"/api/v1/work-orders/{result.Value}", new { id = result.Value }) : BadRequest(new { message = result.Error });
    }

    [HttpPut("{id:guid}")]
    public async Task<IActionResult> UpdateWorkOrder(Guid id, [FromBody] UpdateWorkOrderRequest request)
    {
        var lines = request.Lines.Select(l => new WorkOrderLineInput(
            l.Description, l.ProductVariantId, l.ProductName, l.Sku, l.Quantity, l.UnitPrice
        )).ToList();
        var result = await _mediator.Send(new UpdateWorkOrderCommand(
            id, request.CustomerId, request.CustomerName, request.CustomerPhone, request.CustomerEmail,
            request.DueDate, request.Notes, lines));
        return result.IsSuccess ? NoContent() : BadRequest(new { message = result.Error });
    }

    [HttpPost("{id:guid}/submit")]
    public async Task<IActionResult> SubmitWorkOrder(Guid id)
    {
        var result = await _mediator.Send(new SubmitWorkOrderCommand(id));
        return result.IsSuccess ? Ok() : BadRequest(new { message = result.Error });
    }

    [HttpPost("{id:guid}/start")]
    public async Task<IActionResult> StartWorkOrder(Guid id)
    {
        var result = await _mediator.Send(new StartWorkOrderCommand(id));
        return result.IsSuccess ? Ok() : BadRequest(new { message = result.Error });
    }

    [HttpPost("{id:guid}/complete")]
    public async Task<IActionResult> CompleteWorkOrder(Guid id)
    {
        var result = await _mediator.Send(new CompleteWorkOrderCommand(id));
        return result.IsSuccess ? Ok() : BadRequest(new { message = result.Error });
    }

    [HttpPost("{id:guid}/pickup")]
    public async Task<IActionResult> PickupWorkOrder(Guid id)
    {
        var result = await _mediator.Send(new PickupWorkOrderCommand(id));
        return result.IsSuccess ? Ok() : BadRequest(new { message = result.Error });
    }
}

public class CreateWorkOrderRequest
{
    public Guid CustomerId { get; set; }
    public string CustomerName { get; set; } = string.Empty;
    public string? CustomerPhone { get; set; }
    public string? CustomerEmail { get; set; }
    public DateTime? DueDate { get; set; }
    public string? Notes { get; set; }
    public List<WorkOrderLineRequest> Lines { get; set; } = new();
}

public class UpdateWorkOrderRequest
{
    public Guid CustomerId { get; set; }
    public string CustomerName { get; set; } = string.Empty;
    public string? CustomerPhone { get; set; }
    public string? CustomerEmail { get; set; }
    public DateTime? DueDate { get; set; }
    public string? Notes { get; set; }
    public List<WorkOrderLineRequest> Lines { get; set; } = new();
}

public class WorkOrderLineRequest
{
    public string Description { get; set; } = string.Empty;
    public Guid? ProductVariantId { get; set; }
    public string? ProductName { get; set; }
    public string? Sku { get; set; }
    public int Quantity { get; set; }
    public decimal UnitPrice { get; set; }
}
