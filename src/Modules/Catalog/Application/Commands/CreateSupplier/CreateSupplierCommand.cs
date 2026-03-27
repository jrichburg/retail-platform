using SharedKernel.Application;

namespace Modules.Catalog.Application.Commands.CreateSupplier;

public record CreateSupplierCommand(string Name, string? Code) : ICommand<Guid>;
