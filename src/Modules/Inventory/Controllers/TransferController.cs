using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Modules.Inventory.Application.Commands.CancelTransfer;
using Modules.Inventory.Application.Commands.CompleteTransfer;
using Modules.Inventory.Application.Commands.CreateTransfer;
using Modules.Inventory.Application.Commands.SubmitTransfer;
using Modules.Inventory.Application.Queries.GetTransfer;
using Modules.Inventory.Application.Queries.GetTransfers;

namespace Modules.Inventory.Controllers;

[ApiController]
[Route("api/v1/inventory/transfers")]
[Authorize]
public class TransferController : ControllerBase
{
    private readonly IMediator _mediator;

    public TransferController(IMediator mediator)
    {
        _mediator = mediator;
    }

    [HttpGet]
    public async Task<IActionResult> GetTransfers(
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 25,
        [FromQuery] string? status = null)
    {
        var result = await _mediator.Send(new GetTransfersQuery(page, pageSize, status));
        return result.IsSuccess ? Ok(result.Value) : BadRequest(new { message = result.Error });
    }

    [HttpGet("{id:guid}")]
    public async Task<IActionResult> GetTransfer(Guid id)
    {
        var result = await _mediator.Send(new GetTransferQuery(id));
        return result.IsSuccess ? Ok(result.Value) : NotFound(new { message = result.Error });
    }

    [HttpPost]
    public async Task<IActionResult> CreateTransfer([FromBody] CreateTransferRequest request)
    {
        var lines = request.Lines.Select(l => new TransferLineInput(
            l.ProductId, l.ProductVariantId, l.ProductName, l.Sku, l.Upc, l.VariantDescription, l.Quantity
        )).ToList();

        var result = await _mediator.Send(new CreateTransferCommand(
            request.DestinationTenantNodeId, lines, request.Notes));

        return result.IsSuccess
            ? Created($"/api/v1/inventory/transfers/{result.Value}", new { id = result.Value })
            : BadRequest(new { message = result.Error });
    }

    [HttpPost("{id:guid}/submit")]
    public async Task<IActionResult> SubmitTransfer(Guid id)
    {
        var result = await _mediator.Send(new SubmitTransferCommand(id));
        return result.IsSuccess ? Ok() : BadRequest(new { message = result.Error });
    }

    [HttpPost("{id:guid}/complete")]
    public async Task<IActionResult> CompleteTransfer(Guid id)
    {
        var result = await _mediator.Send(new CompleteTransferCommand(id));
        return result.IsSuccess ? Ok() : BadRequest(new { message = result.Error });
    }

    [HttpPost("{id:guid}/cancel")]
    public async Task<IActionResult> CancelTransfer(Guid id)
    {
        var result = await _mediator.Send(new CancelTransferCommand(id));
        return result.IsSuccess ? Ok() : BadRequest(new { message = result.Error });
    }
}

public class CreateTransferRequest
{
    public Guid DestinationTenantNodeId { get; set; }
    public List<TransferLineRequest> Lines { get; set; } = new();
    public string? Notes { get; set; }
}

public class TransferLineRequest
{
    public Guid ProductId { get; set; }
    public Guid? ProductVariantId { get; set; }
    public string ProductName { get; set; } = string.Empty;
    public string Sku { get; set; } = string.Empty;
    public string? Upc { get; set; }
    public string? VariantDescription { get; set; }
    public int Quantity { get; set; }
}
