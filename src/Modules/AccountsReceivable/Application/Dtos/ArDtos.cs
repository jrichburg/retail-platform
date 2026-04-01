namespace Modules.AccountsReceivable.Application.Dtos;

public class InvoiceDto
{
    public Guid Id { get; set; }
    public string InvoiceNumber { get; set; } = string.Empty;
    public Guid CustomerId { get; set; }
    public string CustomerName { get; set; } = string.Empty;
    public string? SourceType { get; set; }
    public string? SourceReference { get; set; }
    public string Status { get; set; } = string.Empty;
    public DateTime InvoiceDate { get; set; }
    public DateTime DueDate { get; set; }
    public decimal Amount { get; set; }
    public decimal AmountPaid { get; set; }
    public decimal BalanceDue { get; set; }
    public int PaymentCount { get; set; }
    public DateTime CreatedAt { get; set; }
}

public class InvoiceDetailDto
{
    public Guid Id { get; set; }
    public string InvoiceNumber { get; set; } = string.Empty;
    public Guid CustomerId { get; set; }
    public string CustomerName { get; set; } = string.Empty;
    public string? SourceType { get; set; }
    public Guid? SourceId { get; set; }
    public string? SourceReference { get; set; }
    public string Status { get; set; } = string.Empty;
    public DateTime InvoiceDate { get; set; }
    public DateTime DueDate { get; set; }
    public decimal Amount { get; set; }
    public decimal AmountPaid { get; set; }
    public decimal BalanceDue { get; set; }
    public string? Notes { get; set; }
    public DateTime CreatedAt { get; set; }
    public List<PaymentDto> Payments { get; set; } = new();
}

public class PaymentDto
{
    public Guid Id { get; set; }
    public string PaymentNumber { get; set; } = string.Empty;
    public Guid InvoiceId { get; set; }
    public Guid CustomerId { get; set; }
    public decimal Amount { get; set; }
    public string PaymentMethod { get; set; } = string.Empty;
    public DateTime PaymentDate { get; set; }
    public string? Reference { get; set; }
    public string? Notes { get; set; }
    public DateTime CreatedAt { get; set; }
}

public class CustomerBalanceDto
{
    public Guid CustomerId { get; set; }
    public string CustomerName { get; set; } = string.Empty;
    public decimal TotalBalance { get; set; }
    public int OpenInvoiceCount { get; set; }
    public List<InvoiceDto> OpenInvoices { get; set; } = new();
}

public class AgingSummaryDto
{
    public decimal Current { get; set; }
    public decimal ThirtyDays { get; set; }
    public decimal SixtyDays { get; set; }
    public decimal NinetyPlus { get; set; }
    public decimal TotalOutstanding { get; set; }
    public List<AgingCustomerDto> Customers { get; set; } = new();
}

public class AgingCustomerDto
{
    public Guid CustomerId { get; set; }
    public string CustomerName { get; set; } = string.Empty;
    public decimal Current { get; set; }
    public decimal ThirtyDays { get; set; }
    public decimal SixtyDays { get; set; }
    public decimal NinetyPlus { get; set; }
    public decimal TotalBalance { get; set; }
}
