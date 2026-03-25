using SharedKernel.Domain;

namespace Modules.Sales.Domain.Entities;

public class Sale : TenantScopedEntity, IAuditableEntity
{
    public string TransactionNumber { get; set; } = string.Empty;
    public DateTime TransactionDate { get; set; }
    public string Status { get; set; } = "completed"; // completed, voided
    public decimal Subtotal { get; set; }
    public decimal TaxRate { get; set; }
    public decimal TaxAmount { get; set; }
    public decimal TotalAmount { get; set; }
    public decimal TenderedAmount { get; set; }
    public decimal ChangeAmount { get; set; }
    public Guid? CashierId { get; set; }
    public Guid CreatedBy { get; set; }
    public Guid? UpdatedBy { get; set; }

    public ICollection<SaleLineItem> LineItems { get; set; } = new List<SaleLineItem>();
    public ICollection<SaleTender> Tenders { get; set; } = new List<SaleTender>();
}
