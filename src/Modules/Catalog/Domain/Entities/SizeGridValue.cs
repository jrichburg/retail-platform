using SharedKernel.Domain;

namespace Modules.Catalog.Domain.Entities;

public class SizeGridValue : BaseEntity
{
    public Guid SizeGridId { get; set; }
    public int Dimension { get; set; }
    public string Value { get; set; } = string.Empty;
    public int SortOrder { get; set; }

    public SizeGrid SizeGrid { get; set; } = null!;
}
