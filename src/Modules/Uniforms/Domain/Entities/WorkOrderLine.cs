using SharedKernel.Domain;

namespace Modules.Uniforms.Domain.Entities;

public class WorkOrderLine : BaseEntity
{
    public Guid WorkOrderId { get; set; }
    public string Description { get; set; } = string.Empty;
    public Guid? ProductVariantId { get; set; }
    public string? ProductName { get; set; }
    public string? Sku { get; set; }
    public int Quantity { get; set; }
    public decimal UnitPrice { get; set; }

    public WorkOrder WorkOrder { get; set; } = null!;
}
