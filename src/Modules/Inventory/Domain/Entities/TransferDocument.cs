using SharedKernel.Domain;

namespace Modules.Inventory.Domain.Entities;

public class TransferDocument : TenantScopedEntity, IAuditableEntity
{
    public string DocumentNumber { get; set; } = string.Empty;
    public Guid SourceTenantNodeId { get; set; }
    public Guid DestinationTenantNodeId { get; set; }
    public string Status { get; set; } = "draft"; // draft, in_transit, completed, cancelled
    public string? Notes { get; set; }
    public Guid CreatedBy { get; set; }
    public Guid? UpdatedBy { get; set; }

    public ICollection<TransferDocumentLine> Lines { get; set; } = new List<TransferDocumentLine>();
}
