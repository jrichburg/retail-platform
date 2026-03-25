namespace Modules.Sales.Application.Dtos;

public class SaleDto
{
    public Guid Id { get; set; }
    public string TransactionNumber { get; set; } = string.Empty;
    public DateTime TransactionDate { get; set; }
    public string Status { get; set; } = string.Empty;
    public decimal Subtotal { get; set; }
    public decimal TaxRate { get; set; }
    public decimal TaxAmount { get; set; }
    public decimal TotalAmount { get; set; }
    public decimal TenderedAmount { get; set; }
    public decimal ChangeAmount { get; set; }
    public List<SaleLineItemDto> LineItems { get; set; } = new();
    public List<SaleTenderDto> Tenders { get; set; } = new();
}

public class SaleLineItemDto
{
    public Guid ProductId { get; set; }
    public string Sku { get; set; } = string.Empty;
    public string ProductName { get; set; } = string.Empty;
    public int Quantity { get; set; }
    public decimal UnitPrice { get; set; }
    public decimal LineTotal { get; set; }
    public decimal DiscountAmount { get; set; }
}

public class SaleTenderDto
{
    public string TenderType { get; set; } = string.Empty;
    public decimal Amount { get; set; }
    public string? PaymentReference { get; set; }
}
