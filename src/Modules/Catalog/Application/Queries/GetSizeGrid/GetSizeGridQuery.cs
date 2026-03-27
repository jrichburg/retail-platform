using SharedKernel.Application;
using Modules.Catalog.Application.Dtos;

namespace Modules.Catalog.Application.Queries.GetSizeGrid;

public record GetSizeGridQuery(Guid Id) : IQuery<SizeGridDto>;
