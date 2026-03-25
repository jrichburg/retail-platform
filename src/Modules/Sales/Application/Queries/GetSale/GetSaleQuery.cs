using SharedKernel.Application;
using Modules.Sales.Application.Dtos;

namespace Modules.Sales.Application.Queries.GetSale;

public record GetSaleQuery(Guid Id) : IQuery<SaleDto>;
