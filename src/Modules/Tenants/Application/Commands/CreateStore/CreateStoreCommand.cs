using SharedKernel.Application;

namespace Modules.Tenants.Application.Commands.CreateStore;

public record CreateStoreCommand(string Name, string Code, Guid ParentId) : ICommand<Guid>;
