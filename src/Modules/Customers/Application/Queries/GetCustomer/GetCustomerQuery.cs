using SharedKernel.Application;
using Modules.Customers.Application.Dtos;

namespace Modules.Customers.Application.Queries.GetCustomer;

public record GetCustomerQuery(Guid Id) : IQuery<CustomerDto>;
