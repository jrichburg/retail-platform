using SharedKernel.Application;
using Modules.Catalog.Application.Dtos;

namespace Modules.Catalog.Application.Queries.GetSuppliers;

public record GetSuppliersQuery() : IQuery<List<SupplierDto>>;
