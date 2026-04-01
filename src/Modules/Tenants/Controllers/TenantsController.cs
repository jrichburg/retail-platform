using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Modules.Tenants.Application.Commands.CreateStore;
using Modules.Tenants.Application.Commands.UpdateStore;
using Modules.Tenants.Application.Commands.UpdateTenantSetting;
using Modules.Tenants.Application.Queries.GetStore;
using Modules.Tenants.Application.Queries.GetTenantSettings;
using Modules.Tenants.Application.Queries.GetTenantTree;

namespace Modules.Tenants.Controllers;

[ApiController]
[Route("api/v1/tenants")]
[Authorize]
public class TenantsController : ControllerBase
{
    private readonly IMediator _mediator;

    public TenantsController(IMediator mediator)
    {
        _mediator = mediator;
    }

    [HttpGet("tree")]
    public async Task<IActionResult> GetTree()
    {
        var result = await _mediator.Send(new GetTenantTreeQuery());
        return result.IsSuccess ? Ok(result.Value) : BadRequest(new { message = result.Error });
    }

    [HttpGet("stores/{id:guid}")]
    public async Task<IActionResult> GetStore(Guid id)
    {
        var result = await _mediator.Send(new GetStoreQuery(id));
        return result.IsSuccess ? Ok(result.Value) : NotFound(new { message = result.Error });
    }

    [HttpPost("stores")]
    public async Task<IActionResult> CreateStore([FromBody] CreateStoreRequest request)
    {
        var result = await _mediator.Send(new CreateStoreCommand(request.Name, request.Code, request.ParentId));
        return result.IsSuccess ? Created($"/api/v1/tenants/stores/{result.Value}", new { id = result.Value }) : BadRequest(new { message = result.Error });
    }

    [HttpPut("stores/{id:guid}")]
    public async Task<IActionResult> UpdateStore(Guid id, [FromBody] UpdateStoreRequest request)
    {
        var result = await _mediator.Send(new UpdateStoreCommand(id, request.Name, request.Code, request.IsActive));
        return result.IsSuccess ? NoContent() : BadRequest(new { message = result.Error });
    }

    [HttpGet("settings")]
    public async Task<IActionResult> GetSettings([FromQuery] Guid tenantNodeId)
    {
        var result = await _mediator.Send(new GetTenantSettingsQuery(tenantNodeId));
        return result.IsSuccess ? Ok(result.Value) : BadRequest(new { message = result.Error });
    }

    [HttpPut("settings")]
    public async Task<IActionResult> UpdateSetting([FromBody] UpdateSettingRequest request)
    {
        var result = await _mediator.Send(new UpdateTenantSettingCommand(request.TenantNodeId, request.SettingsKey, request.SettingsValue, request.IsLocked));
        return result.IsSuccess ? NoContent() : BadRequest(new { message = result.Error });
    }
}

public class CreateStoreRequest
{
    public string Name { get; set; } = string.Empty;
    public string Code { get; set; } = string.Empty;
    public Guid ParentId { get; set; }
}

public class UpdateStoreRequest
{
    public string Name { get; set; } = string.Empty;
    public string? Code { get; set; }
    public bool IsActive { get; set; } = true;
}

public class UpdateSettingRequest
{
    public Guid TenantNodeId { get; set; }
    public string SettingsKey { get; set; } = string.Empty;
    public string SettingsValue { get; set; } = string.Empty;
    public bool? IsLocked { get; set; }
}
