using SharedKernel.Application;
using Modules.Catalog.Application.Dtos;

namespace Modules.Catalog.Application.Queries.GetDepartments;

public record GetDepartmentsQuery() : IQuery<List<DepartmentDto>>;
