namespace Modules.Platform.Application.Dtos;

public class TenantSummaryDto
{
    public Guid Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Code { get; set; } = string.Empty;
    public int StoreCount { get; set; }
    public int UserCount { get; set; }
    public bool IsActive { get; set; }
    public DateTime CreatedAt { get; set; }
}
