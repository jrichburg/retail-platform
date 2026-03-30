using SharedKernel.Domain;

namespace Modules.Inventory.Domain.Entities;

public class ReceiveDocument : TenantScopedEntity, IAuditableEntity
{
    public string DocumentNumber { get; set; } = string.Empty;
    public Guid? PurchaseOrderId { get; set; }
    public string Status { get; set; } = "completed";
    public string? Notes { get; set; }
    public Guid CreatedBy { get; set; }
    public Guid? UpdatedBy { get; set; }

    public ICollection<ReceiveDocumentLine> Lines { get; set; } = new List<ReceiveDocumentLine>();
}
