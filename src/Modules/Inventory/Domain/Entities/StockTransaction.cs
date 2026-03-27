using SharedKernel.Domain;

namespace Modules.Inventory.Domain.Entities;

public class StockTransaction : TenantScopedEntity, IAuditableEntity
{
    public Guid ProductId { get; set; }
    public Guid? ProductVariantId { get; set; }
    public string TransactionType { get; set; } = string.Empty; // received, adjustment, sale, return
    public int Quantity { get; set; } // positive = in, negative = out
    public int RunningBalance { get; set; }
    public string? Reference { get; set; }
    public string? Notes { get; set; }
    public Guid CreatedBy { get; set; }
    public Guid? UpdatedBy { get; set; }
}
