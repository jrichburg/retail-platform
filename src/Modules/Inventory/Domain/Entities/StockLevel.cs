using SharedKernel.Domain;

namespace Modules.Inventory.Domain.Entities;

public class StockLevel : TenantScopedEntity
{
    public Guid ProductId { get; set; }
    public int QuantityOnHand { get; set; }
    public int QuantityReserved { get; set; }
    public int? ReorderPoint { get; set; }
}
