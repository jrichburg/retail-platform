namespace Modules.Inventory.Application.Dtos;

public class StockTransactionDto
{
    public Guid Id { get; set; }
    public Guid ProductId { get; set; }
    public string TransactionType { get; set; } = string.Empty;
    public int Quantity { get; set; }
    public int RunningBalance { get; set; }
    public string? Reference { get; set; }
    public string? Notes { get; set; }
    public DateTime CreatedAt { get; set; }
}
