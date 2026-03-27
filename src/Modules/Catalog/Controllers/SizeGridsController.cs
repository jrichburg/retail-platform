using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Modules.Catalog.Application.Commands.CreateSizeGrid;
using Modules.Catalog.Application.Commands.UpdateSizeGrid;
using Modules.Catalog.Application.Queries.GetSizeGrid;
using Modules.Catalog.Application.Queries.GetSizeGrids;

namespace Modules.Catalog.Controllers;

[ApiController]
[Route("api/v1/catalog/size-grids")]
[Authorize]
public class SizeGridsController : ControllerBase
{
    private readonly IMediator _mediator;

    public SizeGridsController(IMediator mediator)
    {
        _mediator = mediator;
    }

    [HttpGet]
    public async Task<IActionResult> GetSizeGrids()
    {
        var result = await _mediator.Send(new GetSizeGridsQuery());
        return result.IsSuccess ? Ok(result.Value) : BadRequest(new { message = result.Error });
    }

    [HttpGet("{id:guid}")]
    public async Task<IActionResult> GetSizeGrid(Guid id)
    {
        var result = await _mediator.Send(new GetSizeGridQuery(id));
        return result.IsSuccess ? Ok(result.Value) : NotFound(new { message = result.Error });
    }

    [HttpPost]
    public async Task<IActionResult> CreateSizeGrid([FromBody] CreateSizeGridRequest request)
    {
        var values = request.Values.Select(v => new SizeGridValueInput(v.Dimension, v.Value, v.SortOrder)).ToList();
        var result = await _mediator.Send(new CreateSizeGridCommand(request.Name, request.Dimension1Label, request.Dimension2Label, values));
        return result.IsSuccess ? Created($"/api/v1/catalog/size-grids/{result.Value}", new { id = result.Value }) : BadRequest(new { message = result.Error });
    }

    [HttpPut("{id:guid}")]
    public async Task<IActionResult> UpdateSizeGrid(Guid id, [FromBody] UpdateSizeGridRequest request)
    {
        var values = request.Values.Select(v => new SizeGridValueInput(v.Dimension, v.Value, v.SortOrder)).ToList();
        var result = await _mediator.Send(new UpdateSizeGridCommand(id, request.Name, request.Dimension1Label, request.Dimension2Label, request.IsActive, values));
        return result.IsSuccess ? NoContent() : BadRequest(new { message = result.Error });
    }
}

public class CreateSizeGridRequest
{
    public string Name { get; set; } = string.Empty;
    public string Dimension1Label { get; set; } = "Size";
    public string? Dimension2Label { get; set; }
    public List<SizeGridValueRequest> Values { get; set; } = new();
}

public class UpdateSizeGridRequest
{
    public string Name { get; set; } = string.Empty;
    public string Dimension1Label { get; set; } = "Size";
    public string? Dimension2Label { get; set; }
    public bool IsActive { get; set; } = true;
    public List<SizeGridValueRequest> Values { get; set; } = new();
}

public class SizeGridValueRequest
{
    public int Dimension { get; set; }
    public string Value { get; set; } = string.Empty;
    public int SortOrder { get; set; }
}
