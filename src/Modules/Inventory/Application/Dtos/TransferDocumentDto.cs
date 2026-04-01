namespace Modules.Inventory.Application.Dtos;

public class TransferDocumentDto
{
    public Guid Id { get; set; }
    public string DocumentNumber { get; set; } = string.Empty;
    public Guid SourceTenantNodeId { get; set; }
    public string SourceStoreName { get; set; } = string.Empty;
    public Guid DestinationTenantNodeId { get; set; }
    public string DestinationStoreName { get; set; } = string.Empty;
    public string Status { get; set; } = string.Empty;
    public string? Notes { get; set; }
    public int LineCount { get; set; }
    public int TotalUnits { get; set; }
    public DateTime CreatedAt { get; set; }
}

public class TransferDocumentDetailDto
{
    public Guid Id { get; set; }
    public string DocumentNumber { get; set; } = string.Empty;
    public Guid SourceTenantNodeId { get; set; }
    public string SourceStoreName { get; set; } = string.Empty;
    public Guid DestinationTenantNodeId { get; set; }
    public string DestinationStoreName { get; set; } = string.Empty;
    public string Status { get; set; } = string.Empty;
    public string? Notes { get; set; }
    public DateTime CreatedAt { get; set; }
    public List<TransferDocumentLineDto> Lines { get; set; } = new();
}

public class TransferDocumentLineDto
{
    public Guid Id { get; set; }
    public Guid ProductId { get; set; }
    public Guid? ProductVariantId { get; set; }
    public string ProductName { get; set; } = string.Empty;
    public string Sku { get; set; } = string.Empty;
    public string? Upc { get; set; }
    public string? VariantDescription { get; set; }
    public int Quantity { get; set; }
}
