using SharedKernel.Application;

namespace Modules.Catalog.Application.Commands.CreateDepartment;

public record CreateDepartmentCommand(string Name, int SortOrder = 0) : ICommand<Guid>;
