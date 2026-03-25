using SharedKernel.Application;

namespace Modules.Catalog.Application.Commands.CreateCategory;

public record CreateCategoryCommand(Guid DepartmentId, string Name, int SortOrder = 0) : ICommand<Guid>;
