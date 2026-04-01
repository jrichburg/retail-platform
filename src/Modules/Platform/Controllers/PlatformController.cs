using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Modules.Platform.Application.Authorization;
using Modules.Platform.Application.Commands.CreateTenant;
using Modules.Platform.Application.Commands.DeactivateTenant;
using Modules.Platform.Application.Queries.GetAllTenants;
using Modules.Platform.Application.Queries.GetTenantDetail;

namespace Modules.Platform.Controllers;

[ApiController]
[Route("api/v1/platform")]
[Authorize]
[RequirePlatformAdmin]
public class PlatformController : ControllerBase
{
    private readonly IMediator _mediator;

    public PlatformController(IMediator mediator)
    {
        _mediator = mediator;
    }

    [HttpGet("tenants")]
    public async Task<IActionResult> GetAllTenants()
    {
        var result = await _mediator.Send(new GetAllTenantsQuery());
        return result.IsSuccess ? Ok(result.Value) : BadRequest(new { message = result.Error });
    }

    [HttpGet("tenants/{id:guid}")]
    public async Task<IActionResult> GetTenant(Guid id)
    {
        var result = await _mediator.Send(new GetTenantDetailQuery(id));
        return result.IsSuccess ? Ok(result.Value) : NotFound(new { message = result.Error });
    }

    [HttpPost("tenants")]
    public async Task<IActionResult> CreateTenant([FromBody] CreateTenantRequest request)
    {
        var result = await _mediator.Send(new CreateTenantCommand(
            request.Name,
            request.Code,
            request.AdminEmail,
            request.AdminFirstName,
            request.AdminLastName
        ));
        return result.IsSuccess
            ? Created($"/api/v1/platform/tenants/{result.Value}", new { id = result.Value })
            : BadRequest(new { message = result.Error });
    }

    [HttpPut("tenants/{id:guid}/deactivate")]
    public async Task<IActionResult> DeactivateTenant(Guid id)
    {
        var result = await _mediator.Send(new DeactivateTenantCommand(id));
        return result.IsSuccess ? NoContent() : BadRequest(new { message = result.Error });
    }
}

public class CreateTenantRequest
{
    public string Name { get; set; } = string.Empty;
    public string Code { get; set; } = string.Empty;
    public string AdminEmail { get; set; } = string.Empty;
    public string AdminFirstName { get; set; } = string.Empty;
    public string AdminLastName { get; set; } = string.Empty;
}
