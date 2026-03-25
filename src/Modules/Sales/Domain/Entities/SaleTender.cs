using SharedKernel.Domain;

namespace Modules.Sales.Domain.Entities;

public class SaleTender : BaseEntity
{
    public Guid SaleId { get; set; }
    public string TenderType { get; set; } = string.Empty; // cash, card
    public decimal Amount { get; set; }
    public string? PaymentReference { get; set; }
    public string? PaymentDetails { get; set; } // JSON

    public Sale Sale { get; set; } = null!;
}
