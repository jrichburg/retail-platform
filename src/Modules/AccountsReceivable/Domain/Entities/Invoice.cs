using SharedKernel.Domain;

namespace Modules.AccountsReceivable.Domain.Entities;

public class Invoice : TenantScopedEntity, IAuditableEntity
{
    public string InvoiceNumber { get; set; } = string.Empty;
    public Guid CustomerId { get; set; }
    public string CustomerName { get; set; } = string.Empty;
    public string? SourceType { get; set; }
    public Guid? SourceId { get; set; }
    public string? SourceReference { get; set; }
    public string Status { get; set; } = "open";
    public DateTime InvoiceDate { get; set; }
    public DateTime DueDate { get; set; }
    public decimal Amount { get; set; }
    public decimal AmountPaid { get; set; }
    public decimal BalanceDue { get; set; }
    public string? Notes { get; set; }
    public Guid CreatedBy { get; set; }
    public Guid? UpdatedBy { get; set; }

    public ICollection<Payment> Payments { get; set; } = new List<Payment>();
}
