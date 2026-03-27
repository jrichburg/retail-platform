using SharedKernel.Application;
using Modules.Catalog.Application.Dtos;

namespace Modules.Catalog.Application.Queries.GetSizeGrids;

public record GetSizeGridsQuery() : IQuery<List<SizeGridDto>>;
