using SharedKernel.Domain;

namespace Modules.Uniforms.Domain.Entities;

public class WorkOrder : TenantScopedEntity, IAuditableEntity
{
    public string OrderNumber { get; set; } = string.Empty;
    public Guid CustomerId { get; set; }
    public string CustomerName { get; set; } = string.Empty;
    public string? CustomerPhone { get; set; }
    public string? CustomerEmail { get; set; }
    public string Status { get; set; } = "draft";
    public DateTime? DueDate { get; set; }
    public string? Notes { get; set; }
    public decimal TotalAmount { get; set; }
    public Guid CreatedBy { get; set; }
    public Guid? UpdatedBy { get; set; }

    public ICollection<WorkOrderLine> Lines { get; set; } = new List<WorkOrderLine>();
}
