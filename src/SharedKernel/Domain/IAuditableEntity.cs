namespace SharedKernel.Domain;

public interface IAuditableEntity
{
    Guid CreatedBy { get; set; }
    Guid? UpdatedBy { get; set; }
}
