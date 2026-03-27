using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Modules.Inventory.Application.Commands.AdjustStock;
using Modules.Inventory.Application.Commands.ReceiveStock;
using Modules.Inventory.Application.Queries.GetStockHistory;
using Modules.Inventory.Application.Queries.GetStockLevels;

namespace Modules.Inventory.Controllers;

[ApiController]
[Route("api/v1/inventory")]
[Authorize]
public class InventoryController : ControllerBase
{
    private readonly IMediator _mediator;

    public InventoryController(IMediator mediator)
    {
        _mediator = mediator;
    }

    [HttpGet("stock")]
    public async Task<IActionResult> GetStockLevels([FromQuery] int page = 1, [FromQuery] int pageSize = 25, [FromQuery] string? search = null)
    {
        var result = await _mediator.Send(new GetStockLevelsQuery(page, pageSize, search));
        return result.IsSuccess ? Ok(result.Value) : BadRequest(new { message = result.Error });
    }

    [HttpGet("stock/{productId:guid}/history")]
    public async Task<IActionResult> GetStockHistory(Guid productId, [FromQuery] int page = 1, [FromQuery] int pageSize = 50)
    {
        var result = await _mediator.Send(new GetStockHistoryQuery(productId, page, pageSize));
        return result.IsSuccess ? Ok(result.Value) : BadRequest(new { message = result.Error });
    }

    [HttpPost("receive")]
    public async Task<IActionResult> ReceiveStock([FromBody] ReceiveStockRequest request)
    {
        var result = await _mediator.Send(new ReceiveStockCommand(request.ProductId, request.ProductVariantId, request.Quantity, request.Reference, request.Notes));
        return result.IsSuccess ? Ok() : BadRequest(new { message = result.Error });
    }

    [HttpPost("adjust")]
    public async Task<IActionResult> AdjustStock([FromBody] AdjustStockRequest request)
    {
        var result = await _mediator.Send(new AdjustStockCommand(request.ProductId, request.ProductVariantId, request.Quantity, request.Reason));
        return result.IsSuccess ? Ok() : BadRequest(new { message = result.Error });
    }
}

public class ReceiveStockRequest
{
    public Guid ProductId { get; set; }
    public Guid? ProductVariantId { get; set; }
    public int Quantity { get; set; }
    public string? Reference { get; set; }
    public string? Notes { get; set; }
}

public class AdjustStockRequest
{
    public Guid ProductId { get; set; }
    public Guid? ProductVariantId { get; set; }
    public int Quantity { get; set; }
    public string Reason { get; set; } = string.Empty;
}
