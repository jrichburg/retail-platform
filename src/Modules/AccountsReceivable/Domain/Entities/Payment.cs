using SharedKernel.Domain;

namespace Modules.AccountsReceivable.Domain.Entities;

public class Payment : TenantScopedEntity, IAuditableEntity
{
    public string PaymentNumber { get; set; } = string.Empty;
    public Guid InvoiceId { get; set; }
    public Guid CustomerId { get; set; }
    public decimal Amount { get; set; }
    public string PaymentMethod { get; set; } = string.Empty;
    public DateTime PaymentDate { get; set; }
    public string? Reference { get; set; }
    public string? Notes { get; set; }
    public Guid CreatedBy { get; set; }
    public Guid? UpdatedBy { get; set; }

    public Invoice Invoice { get; set; } = null!;
}
