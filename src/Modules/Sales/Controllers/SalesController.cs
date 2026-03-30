using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Modules.Sales.Application.Commands.CreateSale;
using Modules.Sales.Application.Commands.VoidSale;
using Modules.Sales.Application.Queries.GetSale;
using Modules.Sales.Application.Queries.GetSales;

namespace Modules.Sales.Controllers;

[ApiController]
[Route("api/v1/sales")]
[Authorize]
public class SalesController : ControllerBase
{
    private readonly IMediator _mediator;

    public SalesController(IMediator mediator)
    {
        _mediator = mediator;
    }

    [HttpGet]
    public async Task<IActionResult> GetSales([FromQuery] int page = 1, [FromQuery] int pageSize = 25, [FromQuery] DateTime? from = null, [FromQuery] DateTime? to = null, [FromQuery] string? status = null)
    {
        var result = await _mediator.Send(new GetSalesQuery(page, pageSize, from, to, status));
        return result.IsSuccess ? Ok(result.Value) : BadRequest(new { message = result.Error });
    }

    [HttpGet("{id:guid}")]
    public async Task<IActionResult> GetSale(Guid id)
    {
        var result = await _mediator.Send(new GetSaleQuery(id));
        return result.IsSuccess ? Ok(result.Value) : NotFound(new { message = result.Error });
    }

    [HttpPost]
    public async Task<IActionResult> CreateSale([FromBody] CreateSaleRequest request)
    {
        var command = new CreateSaleCommand(
            Items: request.Items.Select(i => new SaleItemInput(i.ProductId, i.ProductVariantId, i.Quantity)).ToList(),
            Tenders: request.Tenders.Select(t => new SaleTenderInput(t.TenderType, t.Amount)).ToList(),
            CustomerId: request.CustomerId,
            CustomerName: request.CustomerName,
            ClientTransactionId: request.ClientTransactionId
        );
        var result = await _mediator.Send(command);
        return result.IsSuccess ? Created($"/api/v1/sales/{result.Value!.Id}", result.Value) : BadRequest(new { message = result.Error });
    }

    [HttpPost("{id:guid}/void")]
    public async Task<IActionResult> VoidSale(Guid id)
    {
        var result = await _mediator.Send(new VoidSaleCommand(id));
        return result.IsSuccess ? Ok() : BadRequest(new { message = result.Error });
    }
}

public class CreateSaleRequest
{
    public List<SaleItemRequest> Items { get; set; } = new();
    public List<SaleTenderRequest> Tenders { get; set; } = new();
    public Guid? CustomerId { get; set; }
    public string? CustomerName { get; set; }
    public Guid? ClientTransactionId { get; set; }
}

public class SaleItemRequest
{
    public Guid ProductId { get; set; }
    public Guid? ProductVariantId { get; set; }
    public int Quantity { get; set; }
}

public class SaleTenderRequest
{
    public string TenderType { get; set; } = string.Empty;
    public decimal Amount { get; set; }
}
