using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Modules.Inventory.Application.Commands.CreateReceiveDocument;
using Modules.Inventory.Application.Commands.ReceiveAgainstPO;
using Modules.Inventory.Application.Queries.GetReceiveDocument;
using Modules.Inventory.Application.Queries.GetReceiveDocuments;

namespace Modules.Inventory.Controllers;

[ApiController]
[Route("api/v1/inventory/receiving")]
[Authorize]
public class ReceivingController : ControllerBase
{
    private readonly IMediator _mediator;

    public ReceivingController(IMediator mediator)
    {
        _mediator = mediator;
    }

    [HttpGet]
    public async Task<IActionResult> GetReceiveDocuments([FromQuery] int page = 1, [FromQuery] int pageSize = 25)
    {
        var result = await _mediator.Send(new GetReceiveDocumentsQuery(page, pageSize));
        return result.IsSuccess ? Ok(result.Value) : BadRequest(new { message = result.Error });
    }

    [HttpGet("{id:guid}")]
    public async Task<IActionResult> GetReceiveDocument(Guid id)
    {
        var result = await _mediator.Send(new GetReceiveDocumentQuery(id));
        return result.IsSuccess ? Ok(result.Value) : NotFound(new { message = result.Error });
    }

    [HttpPost]
    public async Task<IActionResult> CreateReceiveDocument([FromBody] CreateReceiveDocumentRequest request)
    {
        var lines = request.Lines.Select(l => new ReceiveLineInput(
            l.ProductId, l.ProductVariantId, l.ProductName, l.Sku, l.Upc, l.VariantDescription, l.Quantity
        )).ToList();

        var result = await _mediator.Send(new CreateReceiveDocumentCommand(lines, request.Notes));
        return result.IsSuccess
            ? Created($"/api/v1/inventory/receiving/{result.Value}", new { id = result.Value })
            : BadRequest(new { message = result.Error });
    }

    [HttpPost("against-po")]
    public async Task<IActionResult> ReceiveAgainstPO([FromBody] ReceiveAgainstPORequest request)
    {
        var lines = request.Lines.Select(l => new ReceiveAgainstPOLineInput(
            l.ProductId, l.ProductVariantId, l.ProductName, l.Sku, l.Upc, l.VariantDescription, l.Quantity
        )).ToList();
        var result = await _mediator.Send(new ReceiveAgainstPOCommand(request.PurchaseOrderId, lines, request.Notes));
        return result.IsSuccess
            ? Created($"/api/v1/inventory/receiving/{result.Value}", new { id = result.Value })
            : BadRequest(new { message = result.Error });
    }
}

public class CreateReceiveDocumentRequest
{
    public List<ReceiveLineRequest> Lines { get; set; } = new();
    public string? Notes { get; set; }
}

public class ReceiveAgainstPORequest
{
    public Guid PurchaseOrderId { get; set; }
    public List<ReceiveLineRequest> Lines { get; set; } = new();
    public string? Notes { get; set; }
}

public class ReceiveLineRequest
{
    public Guid ProductId { get; set; }
    public Guid? ProductVariantId { get; set; }
    public string ProductName { get; set; } = string.Empty;
    public string Sku { get; set; } = string.Empty;
    public string? Upc { get; set; }
    public string? VariantDescription { get; set; }
    public int Quantity { get; set; }
}
