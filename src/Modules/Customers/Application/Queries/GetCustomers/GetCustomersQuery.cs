using SharedKernel.Application;
using Modules.Customers.Application.Dtos;

namespace Modules.Customers.Application.Queries.GetCustomers;

public record GetCustomersQuery(int Page = 1, int PageSize = 25, string? Search = null) : IQuery<PagedResult<CustomerDto>>;
