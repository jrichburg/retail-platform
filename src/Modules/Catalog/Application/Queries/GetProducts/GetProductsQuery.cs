using SharedKernel.Application;
using Modules.Catalog.Application.Dtos;

namespace Modules.Catalog.Application.Queries.GetProducts;

public record GetProductsQuery(
    int Page = 1,
    int PageSize = 25,
    string? Search = null,
    Guid? CategoryId = null,
    bool? IsActive = null
) : IQuery<PagedResult<ProductDto>>;
