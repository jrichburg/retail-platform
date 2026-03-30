using SharedKernel.Domain;

namespace Modules.Inventory.Domain.Entities;

public class PurchaseOrder : TenantScopedEntity, IAuditableEntity
{
    public string OrderNumber { get; set; } = string.Empty;
    public Guid SupplierId { get; set; }
    public string SupplierName { get; set; } = string.Empty;
    public string Status { get; set; } = "draft";
    public string? Notes { get; set; }
    public DateTime? ExpectedDate { get; set; }
    public decimal TotalCost { get; set; }
    public Guid CreatedBy { get; set; }
    public Guid? UpdatedBy { get; set; }

    public ICollection<PurchaseOrderLine> Lines { get; set; } = new List<PurchaseOrderLine>();
}
