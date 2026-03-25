using SharedKernel.Application;
using Modules.Catalog.Application.Dtos;

namespace Modules.Catalog.Application.Queries.GetProduct;

public record GetProductQuery(Guid Id) : IQuery<ProductDto>;
