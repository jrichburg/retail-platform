namespace Modules.Catalog.Application.Dtos;

public class SizeGridDto
{
    public Guid Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Dimension1Label { get; set; } = string.Empty;
    public string? Dimension2Label { get; set; }
    public bool IsActive { get; set; }
    public List<SizeGridValueDto> Values { get; set; } = new();
}

public class SizeGridValueDto
{
    public Guid Id { get; set; }
    public int Dimension { get; set; }
    public string Value { get; set; } = string.Empty;
    public int SortOrder { get; set; }
}
