using SharedKernel.Domain;

namespace Modules.Inventory.Domain.Entities;

public class ReceiveDocumentLine : BaseEntity
{
    public Guid ReceiveDocumentId { get; set; }
    public Guid ProductId { get; set; }
    public Guid? ProductVariantId { get; set; }
    public string ProductName { get; set; } = string.Empty;
    public string Sku { get; set; } = string.Empty;
    public string? Upc { get; set; }
    public string? VariantDescription { get; set; }
    public int Quantity { get; set; }

    public ReceiveDocument ReceiveDocument { get; set; } = null!;
}
