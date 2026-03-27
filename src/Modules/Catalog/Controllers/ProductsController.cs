using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Modules.Catalog.Application.Commands.CreateProduct;
using Modules.Catalog.Application.Commands.UpdateProduct;
using Modules.Catalog.Application.Queries.GetProduct;
using Modules.Catalog.Application.Queries.GetProducts;
using Modules.Catalog.Application.Queries.LookupProduct;

namespace Modules.Catalog.Controllers;

[ApiController]
[Route("api/v1/catalog/products")]
[Authorize]
public class ProductsController : ControllerBase
{
    private readonly IMediator _mediator;

    public ProductsController(IMediator mediator)
    {
        _mediator = mediator;
    }

    [HttpGet]
    public async Task<IActionResult> GetProducts([FromQuery] int page = 1, [FromQuery] int pageSize = 25, [FromQuery] string? search = null, [FromQuery] Guid? categoryId = null, [FromQuery] bool? isActive = null)
    {
        var result = await _mediator.Send(new GetProductsQuery(page, pageSize, search, categoryId, isActive));
        return result.IsSuccess ? Ok(result.Value) : BadRequest(new { message = result.Error });
    }

    [HttpGet("{id:guid}")]
    public async Task<IActionResult> GetProduct(Guid id)
    {
        var result = await _mediator.Send(new GetProductQuery(id));
        return result.IsSuccess ? Ok(result.Value) : NotFound(new { message = result.Error });
    }

    [HttpGet("lookup")]
    public async Task<IActionResult> LookupProduct([FromQuery] string? sku = null, [FromQuery] string? upc = null)
    {
        var result = await _mediator.Send(new LookupProductQuery(sku, upc));
        return result.IsSuccess ? Ok(result.Value) : NotFound(new { message = result.Error });
    }

    [HttpPost]
    public async Task<IActionResult> CreateProduct([FromBody] CreateProductRequest request)
    {
        var variants = request.Variants?.Select(v => new ProductVariantInput(v.Dimension1Value, v.Dimension2Value, v.Upc)).ToList();
        var result = await _mediator.Send(new CreateProductCommand(
            request.Name, request.Sku, request.CategoryId, request.SupplierId,
            request.Color, request.MapDate, request.SizeGridId,
            request.RetailPrice, request.CostPrice, request.Description, variants));
        return result.IsSuccess ? Created($"/api/v1/catalog/products/{result.Value}", new { id = result.Value }) : BadRequest(new { message = result.Error });
    }

    [HttpPut("{id:guid}")]
    public async Task<IActionResult> UpdateProduct(Guid id, [FromBody] UpdateProductRequest request)
    {
        var variants = request.Variants?.Select(v => new ProductVariantInput(v.Dimension1Value, v.Dimension2Value, v.Upc)).ToList();
        var result = await _mediator.Send(new UpdateProductCommand(
            id, request.Name, request.Sku, request.CategoryId, request.SupplierId,
            request.Color, request.MapDate, request.SizeGridId,
            request.RetailPrice, request.CostPrice, request.Description, request.IsActive, variants));
        return result.IsSuccess ? NoContent() : BadRequest(new { message = result.Error });
    }
}

public class CreateProductRequest
{
    public string Name { get; set; } = string.Empty;
    public string Sku { get; set; } = string.Empty;
    public Guid CategoryId { get; set; }
    public Guid? SupplierId { get; set; }
    public string? Color { get; set; }
    public DateTime? MapDate { get; set; }
    public Guid? SizeGridId { get; set; }
    public decimal RetailPrice { get; set; }
    public decimal? CostPrice { get; set; }
    public string? Description { get; set; }
    public List<VariantRequest>? Variants { get; set; }
}

public class UpdateProductRequest
{
    public string Name { get; set; } = string.Empty;
    public string Sku { get; set; } = string.Empty;
    public Guid CategoryId { get; set; }
    public Guid? SupplierId { get; set; }
    public string? Color { get; set; }
    public DateTime? MapDate { get; set; }
    public Guid? SizeGridId { get; set; }
    public decimal RetailPrice { get; set; }
    public decimal? CostPrice { get; set; }
    public string? Description { get; set; }
    public bool IsActive { get; set; } = true;
    public List<VariantRequest>? Variants { get; set; }
}

public class VariantRequest
{
    public string? Dimension1Value { get; set; }
    public string? Dimension2Value { get; set; }
    public string? Upc { get; set; }
}
