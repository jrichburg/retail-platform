namespace Modules.Inventory.Application.Dtos;

public class StockLevelDto
{
    public Guid Id { get; set; }
    public Guid ProductId { get; set; }
    public string ProductName { get; set; } = string.Empty;
    public string Sku { get; set; } = string.Empty;
    public int QuantityOnHand { get; set; }
    public int QuantityReserved { get; set; }
    public int AvailableQuantity => QuantityOnHand - QuantityReserved;
    public int? ReorderPoint { get; set; }
}
