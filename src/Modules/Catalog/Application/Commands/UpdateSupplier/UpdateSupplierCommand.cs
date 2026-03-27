using SharedKernel.Application;

namespace Modules.Catalog.Application.Commands.UpdateSupplier;

public record UpdateSupplierCommand(Guid Id, string Name, string? Code, bool IsActive) : ICommand;
