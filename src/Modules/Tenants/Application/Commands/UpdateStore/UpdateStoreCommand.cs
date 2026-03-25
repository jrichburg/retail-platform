using SharedKernel.Application;

namespace Modules.Tenants.Application.Commands.UpdateStore;

public record UpdateStoreCommand(Guid Id, string Name, string? Code, bool IsActive) : ICommand;
