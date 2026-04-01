namespace Modules.Uniforms.Application.Dtos;

public class WorkOrderDto
{
    public Guid Id { get; set; }
    public string OrderNumber { get; set; } = string.Empty;
    public Guid CustomerId { get; set; }
    public string CustomerName { get; set; } = string.Empty;
    public string? CustomerPhone { get; set; }
    public string Status { get; set; } = string.Empty;
    public DateTime? DueDate { get; set; }
    public string? Notes { get; set; }
    public decimal TotalAmount { get; set; }
    public int LineCount { get; set; }
    public DateTime CreatedAt { get; set; }
}

public class WorkOrderDetailDto
{
    public Guid Id { get; set; }
    public string OrderNumber { get; set; } = string.Empty;
    public Guid CustomerId { get; set; }
    public string CustomerName { get; set; } = string.Empty;
    public string? CustomerPhone { get; set; }
    public string? CustomerEmail { get; set; }
    public string Status { get; set; } = string.Empty;
    public DateTime? DueDate { get; set; }
    public string? Notes { get; set; }
    public decimal TotalAmount { get; set; }
    public DateTime CreatedAt { get; set; }
    public List<WorkOrderLineDto> Lines { get; set; } = new();
}

public class WorkOrderLineDto
{
    public Guid Id { get; set; }
    public string Description { get; set; } = string.Empty;
    public Guid? ProductVariantId { get; set; }
    public string? ProductName { get; set; }
    public string? Sku { get; set; }
    public int Quantity { get; set; }
    public decimal UnitPrice { get; set; }
    public decimal LineTotal { get; set; }
}
