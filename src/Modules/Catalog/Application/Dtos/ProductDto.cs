namespace Modules.Catalog.Application.Dtos;

public class ProductDto
{
    public Guid Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Sku { get; set; } = string.Empty;
    public string? Upc { get; set; }
    public Guid CategoryId { get; set; }
    public string CategoryName { get; set; } = string.Empty;
    public string DepartmentName { get; set; } = string.Empty;
    public decimal RetailPrice { get; set; }
    public decimal? CostPrice { get; set; }
    public string? Description { get; set; }
    public bool IsActive { get; set; }
}
