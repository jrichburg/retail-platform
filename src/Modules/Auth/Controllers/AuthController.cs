using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Modules.Auth.Application.Commands.AssignRole;
using Modules.Auth.Application.Commands.CreateUser;
using Modules.Auth.Application.Commands.SyncUser;
using Modules.Auth.Application.Commands.UpdateUser;
using Modules.Auth.Application.Queries.GetCurrentUser;
using Modules.Auth.Application.Queries.GetRoles;
using Modules.Auth.Application.Queries.GetUsers;
using SharedKernel.Application;

namespace Modules.Auth.Controllers;

[ApiController]
[Route("api/v1/auth")]
[Authorize]
public class AuthController : ControllerBase
{
    private readonly IMediator _mediator;
    private readonly ICurrentUser _currentUser;

    public AuthController(IMediator mediator, ICurrentUser currentUser)
    {
        _mediator = mediator;
        _currentUser = currentUser;
    }

    [HttpGet("me")]
    public async Task<IActionResult> GetCurrentUser()
    {
        var result = await _mediator.Send(new GetCurrentUserQuery(_currentUser.UserId));
        return result.IsSuccess ? Ok(result.Value) : BadRequest(new { message = result.Error });
    }

    [HttpPost("sync")]
    public async Task<IActionResult> SyncUser([FromBody] SyncUserRequest request)
    {
        var command = new SyncUserCommand(
            SupabaseUserId: _currentUser.UserId,
            Email: _currentUser.Email,
            FirstName: request.FirstName,
            LastName: request.LastName,
            TenantNodeId: request.TenantNodeId,
            RootTenantId: request.RootTenantId
        );

        var result = await _mediator.Send(command);
        return result.IsSuccess ? Ok(result.Value) : BadRequest(new { message = result.Error });
    }
    [HttpGet("users")]
    public async Task<IActionResult> GetUsers([FromQuery] int page = 1, [FromQuery] int pageSize = 25, [FromQuery] string? search = null, [FromQuery] bool? isActive = null)
    {
        var result = await _mediator.Send(new GetUsersQuery(page, pageSize, search, isActive));
        return result.IsSuccess ? Ok(result.Value) : BadRequest(new { message = result.Error });
    }

    [HttpPost("users")]
    public async Task<IActionResult> CreateUser([FromBody] CreateUserRequest request)
    {
        var result = await _mediator.Send(new CreateUserCommand(request.Email, request.FirstName, request.LastName, request.RoleId));
        return result.IsSuccess ? Created($"/api/v1/auth/users/{result.Value}", new { id = result.Value }) : BadRequest(new { message = result.Error });
    }

    [HttpPut("users/{id:guid}")]
    public async Task<IActionResult> UpdateUser(Guid id, [FromBody] UpdateUserRequest request)
    {
        var result = await _mediator.Send(new UpdateUserCommand(id, request.FirstName, request.LastName, request.IsActive));
        return result.IsSuccess ? NoContent() : BadRequest(new { message = result.Error });
    }

    [HttpPut("users/{id:guid}/role")]
    public async Task<IActionResult> AssignRole(Guid id, [FromBody] AssignRoleRequest request)
    {
        var result = await _mediator.Send(new AssignRoleCommand(id, request.RoleId));
        return result.IsSuccess ? NoContent() : BadRequest(new { message = result.Error });
    }

    [HttpGet("roles")]
    public async Task<IActionResult> GetRoles()
    {
        var result = await _mediator.Send(new GetRolesQuery());
        return result.IsSuccess ? Ok(result.Value) : BadRequest(new { message = result.Error });
    }
}

public class SyncUserRequest
{
    public string? FirstName { get; set; }
    public string? LastName { get; set; }
    public Guid TenantNodeId { get; set; }
    public Guid RootTenantId { get; set; }
}

public class CreateUserRequest
{
    public string Email { get; set; } = string.Empty;
    public string FirstName { get; set; } = string.Empty;
    public string LastName { get; set; } = string.Empty;
    public Guid RoleId { get; set; }
}

public class UpdateUserRequest
{
    public string FirstName { get; set; } = string.Empty;
    public string LastName { get; set; } = string.Empty;
    public bool IsActive { get; set; } = true;
}

public class AssignRoleRequest
{
    public Guid RoleId { get; set; }
}
