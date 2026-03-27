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
    public Guid? SupplierId { get; set; }
    public string? SupplierName { get; set; }
    public string? Style { get; set; }
    public string? Color { get; set; }
    public DateTime? MapDate { get; set; }
    public Guid? SizeGridId { get; set; }
    public string? SizeGridName { get; set; }
    public decimal RetailPrice { get; set; }
    public decimal? CostPrice { get; set; }
    public string? Description { get; set; }
    public bool IsActive { get; set; }
    public int VariantCount { get; set; }
    public List<ProductVariantDto>? Variants { get; set; }
}

public class ProductVariantDto
{
    public Guid Id { get; set; }
    public string? Dimension1Value { get; set; }
    public string? Dimension2Value { get; set; }
    public string? Upc { get; set; }
    public bool IsActive { get; set; }
}
