using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Modules.AccountsReceivable.Application.Commands.CreateInvoice;
using Modules.AccountsReceivable.Application.Commands.RecordPayment;
using Modules.AccountsReceivable.Application.Commands.VoidInvoice;
using Modules.AccountsReceivable.Application.Queries.GetAgingSummary;
using Modules.AccountsReceivable.Application.Queries.GetCustomerBalance;
using Modules.AccountsReceivable.Application.Queries.GetInvoice;
using Modules.AccountsReceivable.Application.Queries.GetInvoices;
using Modules.AccountsReceivable.Application.Queries.GetPayments;

namespace Modules.AccountsReceivable.Controllers;

[ApiController]
[Route("api/v1/ar")]
[Authorize]
public class AccountsReceivableController : ControllerBase
{
    private readonly IMediator _mediator;

    public AccountsReceivableController(IMediator mediator)
    {
        _mediator = mediator;
    }

    [HttpGet("invoices")]
    public async Task<IActionResult> GetInvoices([FromQuery] int page = 1, [FromQuery] int pageSize = 25, [FromQuery] string? status = null, [FromQuery] Guid? customerId = null)
    {
        var result = await _mediator.Send(new GetInvoicesQuery(page, pageSize, status, customerId));
        return result.IsSuccess ? Ok(result.Value) : BadRequest(new { message = result.Error });
    }

    [HttpGet("invoices/{id:guid}")]
    public async Task<IActionResult> GetInvoice(Guid id)
    {
        var result = await _mediator.Send(new GetInvoiceQuery(id));
        return result.IsSuccess ? Ok(result.Value) : NotFound(new { message = result.Error });
    }

    [HttpPost("invoices")]
    public async Task<IActionResult> CreateInvoice([FromBody] CreateInvoiceRequest request)
    {
        var result = await _mediator.Send(new CreateInvoiceCommand(
            request.CustomerId, request.CustomerName, request.SourceType, request.SourceId,
            request.SourceReference, request.Amount, request.DueDate, request.Notes));
        return result.IsSuccess ? Created($"/api/v1/ar/invoices/{result.Value}", new { id = result.Value }) : BadRequest(new { message = result.Error });
    }

    [HttpPost("invoices/{id:guid}/void")]
    public async Task<IActionResult> VoidInvoice(Guid id)
    {
        var result = await _mediator.Send(new VoidInvoiceCommand(id));
        return result.IsSuccess ? Ok() : BadRequest(new { message = result.Error });
    }

    [HttpPost("payments")]
    public async Task<IActionResult> RecordPayment([FromBody] RecordPaymentRequest request)
    {
        var result = await _mediator.Send(new RecordPaymentCommand(
            request.InvoiceId, request.Amount, request.PaymentMethod, request.PaymentDate,
            request.Reference, request.Notes));
        return result.IsSuccess ? Created($"/api/v1/ar/payments/{result.Value}", new { id = result.Value }) : BadRequest(new { message = result.Error });
    }

    [HttpGet("payments")]
    public async Task<IActionResult> GetPayments([FromQuery] int page = 1, [FromQuery] int pageSize = 25, [FromQuery] Guid? customerId = null, [FromQuery] Guid? invoiceId = null)
    {
        var result = await _mediator.Send(new GetPaymentsQuery(page, pageSize, customerId, invoiceId));
        return result.IsSuccess ? Ok(result.Value) : BadRequest(new { message = result.Error });
    }

    [HttpGet("aging")]
    public async Task<IActionResult> GetAgingSummary()
    {
        var result = await _mediator.Send(new GetAgingSummaryQuery());
        return result.IsSuccess ? Ok(result.Value) : BadRequest(new { message = result.Error });
    }

    [HttpGet("customers/{customerId:guid}/balance")]
    public async Task<IActionResult> GetCustomerBalance(Guid customerId)
    {
        var result = await _mediator.Send(new GetCustomerBalanceQuery(customerId));
        return result.IsSuccess ? Ok(result.Value) : NotFound(new { message = result.Error });
    }
}

public class CreateInvoiceRequest
{
    public Guid CustomerId { get; set; }
    public string CustomerName { get; set; } = string.Empty;
    public string? SourceType { get; set; }
    public Guid? SourceId { get; set; }
    public string? SourceReference { get; set; }
    public decimal Amount { get; set; }
    public DateTime DueDate { get; set; }
    public string? Notes { get; set; }
}

public class RecordPaymentRequest
{
    public Guid InvoiceId { get; set; }
    public decimal Amount { get; set; }
    public string PaymentMethod { get; set; } = string.Empty;
    public DateTime PaymentDate { get; set; }
    public string? Reference { get; set; }
    public string? Notes { get; set; }
}
