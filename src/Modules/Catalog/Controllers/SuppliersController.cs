using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Modules.Catalog.Application.Commands.CreateSupplier;
using Modules.Catalog.Application.Commands.UpdateSupplier;
using Modules.Catalog.Application.Queries.GetSuppliers;

namespace Modules.Catalog.Controllers;

[ApiController]
[Route("api/v1/catalog/suppliers")]
[Authorize]
public class SuppliersController : ControllerBase
{
    private readonly IMediator _mediator;

    public SuppliersController(IMediator mediator)
    {
        _mediator = mediator;
    }

    [HttpGet]
    public async Task<IActionResult> GetSuppliers()
    {
        var result = await _mediator.Send(new GetSuppliersQuery());
        return result.IsSuccess ? Ok(result.Value) : BadRequest(new { message = result.Error });
    }

    [HttpPost]
    public async Task<IActionResult> CreateSupplier([FromBody] CreateSupplierRequest request)
    {
        var result = await _mediator.Send(new CreateSupplierCommand(request.Name, request.Code));
        return result.IsSuccess ? Created($"/api/v1/catalog/suppliers/{result.Value}", new { id = result.Value }) : BadRequest(new { message = result.Error });
    }

    [HttpPut("{id:guid}")]
    public async Task<IActionResult> UpdateSupplier(Guid id, [FromBody] UpdateSupplierRequest request)
    {
        var result = await _mediator.Send(new UpdateSupplierCommand(id, request.Name, request.Code, request.IsActive));
        return result.IsSuccess ? NoContent() : BadRequest(new { message = result.Error });
    }
}

public class CreateSupplierRequest
{
    public string Name { get; set; } = string.Empty;
    public string? Code { get; set; }
}

public class UpdateSupplierRequest
{
    public string Name { get; set; } = string.Empty;
    public string? Code { get; set; }
    public bool IsActive { get; set; } = true;
}
