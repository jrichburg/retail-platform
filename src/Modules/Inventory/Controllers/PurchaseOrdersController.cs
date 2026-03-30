using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Modules.Inventory.Application.Commands.ClosePurchaseOrder;
using Modules.Inventory.Application.Commands.CreatePurchaseOrder;
using Modules.Inventory.Application.Commands.SubmitPurchaseOrder;
using Modules.Inventory.Application.Commands.UpdatePurchaseOrder;
using Modules.Inventory.Application.Queries.GetPurchaseOrder;
using Modules.Inventory.Application.Queries.GetPurchaseOrders;

namespace Modules.Inventory.Controllers;

[ApiController]
[Route("api/v1/inventory/purchase-orders")]
[Authorize]
public class PurchaseOrdersController : ControllerBase
{
    private readonly IMediator _mediator;

    public PurchaseOrdersController(IMediator mediator)
    {
        _mediator = mediator;
    }

    [HttpGet]
    public async Task<IActionResult> GetPurchaseOrders([FromQuery] int page = 1, [FromQuery] int pageSize = 25, [FromQuery] string? status = null, [FromQuery] Guid? supplierId = null)
    {
        var result = await _mediator.Send(new GetPurchaseOrdersQuery(page, pageSize, status, supplierId));
        return result.IsSuccess ? Ok(result.Value) : BadRequest(new { message = result.Error });
    }

    [HttpGet("{id:guid}")]
    public async Task<IActionResult> GetPurchaseOrder(Guid id)
    {
        var result = await _mediator.Send(new GetPurchaseOrderQuery(id));
        return result.IsSuccess ? Ok(result.Value) : NotFound(new { message = result.Error });
    }

    [HttpPost]
    public async Task<IActionResult> CreatePurchaseOrder([FromBody] CreatePurchaseOrderRequest request)
    {
        var lines = request.Lines.Select(l => new PurchaseOrderLineInput(
            l.ProductId, l.ProductVariantId, l.ProductName, l.Sku, l.VariantDescription, l.QuantityOrdered, l.UnitCost
        )).ToList();
        var result = await _mediator.Send(new CreatePurchaseOrderCommand(request.SupplierId, request.SupplierName, request.Notes, request.ExpectedDate, lines));
        return result.IsSuccess ? Created($"/api/v1/inventory/purchase-orders/{result.Value}", new { id = result.Value }) : BadRequest(new { message = result.Error });
    }

    [HttpPut("{id:guid}")]
    public async Task<IActionResult> UpdatePurchaseOrder(Guid id, [FromBody] UpdatePurchaseOrderRequest request)
    {
        var lines = request.Lines.Select(l => new PurchaseOrderLineInput(
            l.ProductId, l.ProductVariantId, l.ProductName, l.Sku, l.VariantDescription, l.QuantityOrdered, l.UnitCost
        )).ToList();
        var result = await _mediator.Send(new UpdatePurchaseOrderCommand(id, request.Notes, request.ExpectedDate, lines));
        return result.IsSuccess ? NoContent() : BadRequest(new { message = result.Error });
    }

    [HttpPost("{id:guid}/submit")]
    public async Task<IActionResult> SubmitPurchaseOrder(Guid id)
    {
        var result = await _mediator.Send(new SubmitPurchaseOrderCommand(id));
        return result.IsSuccess ? Ok() : BadRequest(new { message = result.Error });
    }

    [HttpPost("{id:guid}/close")]
    public async Task<IActionResult> ClosePurchaseOrder(Guid id)
    {
        var result = await _mediator.Send(new ClosePurchaseOrderCommand(id));
        return result.IsSuccess ? Ok() : BadRequest(new { message = result.Error });
    }
}

public class CreatePurchaseOrderRequest
{
    public Guid SupplierId { get; set; }
    public string SupplierName { get; set; } = string.Empty;
    public string? Notes { get; set; }
    public DateTime? ExpectedDate { get; set; }
    public List<PurchaseOrderLineRequest> Lines { get; set; } = new();
}

public class UpdatePurchaseOrderRequest
{
    public string? Notes { get; set; }
    public DateTime? ExpectedDate { get; set; }
    public List<PurchaseOrderLineRequest> Lines { get; set; } = new();
}

public class PurchaseOrderLineRequest
{
    public Guid ProductId { get; set; }
    public Guid? ProductVariantId { get; set; }
    public string ProductName { get; set; } = string.Empty;
    public string Sku { get; set; } = string.Empty;
    public string? VariantDescription { get; set; }
    public int QuantityOrdered { get; set; }
    public decimal UnitCost { get; set; }
}
