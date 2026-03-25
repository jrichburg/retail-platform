using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Modules.Catalog.Application.Commands.CreateCategory;
using Modules.Catalog.Application.Commands.CreateDepartment;
using Modules.Catalog.Application.Queries.GetDepartments;

namespace Modules.Catalog.Controllers;

[ApiController]
[Route("api/v1/catalog/departments")]
[Authorize]
public class DepartmentsController : ControllerBase
{
    private readonly IMediator _mediator;

    public DepartmentsController(IMediator mediator)
    {
        _mediator = mediator;
    }

    [HttpGet]
    public async Task<IActionResult> GetDepartments()
    {
        var result = await _mediator.Send(new GetDepartmentsQuery());
        return result.IsSuccess ? Ok(result.Value) : BadRequest(new { message = result.Error });
    }

    [HttpPost]
    public async Task<IActionResult> CreateDepartment([FromBody] CreateDepartmentRequest request)
    {
        var result = await _mediator.Send(new CreateDepartmentCommand(request.Name, request.SortOrder));
        return result.IsSuccess ? Created($"/api/v1/catalog/departments/{result.Value}", new { id = result.Value }) : BadRequest(new { message = result.Error });
    }

    [HttpPost("{departmentId:guid}/categories")]
    public async Task<IActionResult> CreateCategory(Guid departmentId, [FromBody] CreateCategoryRequest request)
    {
        var result = await _mediator.Send(new CreateCategoryCommand(departmentId, request.Name, request.SortOrder));
        return result.IsSuccess ? Created("", new { id = result.Value }) : BadRequest(new { message = result.Error });
    }
}

public class CreateDepartmentRequest
{
    public string Name { get; set; } = string.Empty;
    public int SortOrder { get; set; }
}

public class CreateCategoryRequest
{
    public string Name { get; set; } = string.Empty;
    public int SortOrder { get; set; }
}
