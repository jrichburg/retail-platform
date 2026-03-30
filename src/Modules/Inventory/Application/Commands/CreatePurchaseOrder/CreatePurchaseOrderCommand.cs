using SharedKernel.Application;

namespace Modules.Inventory.Application.Commands.CreatePurchaseOrder;

public record CreatePurchaseOrderCommand(
    Guid SupplierId,
    string SupplierName,
    string? Notes,
    DateTime? ExpectedDate,
    List<PurchaseOrderLineInput> Lines
) : ICommand<Guid>;

public record PurchaseOrderLineInput(
    Guid ProductId,
    Guid? ProductVariantId,
    string ProductName,
    string Sku,
    string? VariantDescription,
    int QuantityOrdered,
    decimal UnitCost
);
