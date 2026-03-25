using SharedKernel.Application;
using Modules.Catalog.Application.Dtos;

namespace Modules.Catalog.Application.Queries.LookupProduct;

public record LookupProductQuery(string? Sku = null, string? Upc = null) : IQuery<ProductDto>;
