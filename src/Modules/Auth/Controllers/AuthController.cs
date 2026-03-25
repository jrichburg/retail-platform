using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Modules.Auth.Application.Commands.SyncUser;
using Modules.Auth.Application.Queries.GetCurrentUser;
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
}

public class SyncUserRequest
{
    public string? FirstName { get; set; }
    public string? LastName { get; set; }
    public Guid TenantNodeId { get; set; }
    public Guid RootTenantId { get; set; }
}
