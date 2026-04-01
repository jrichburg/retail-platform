using SharedKernel.Application;
using Modules.AccountsReceivable.Application.Dtos;

namespace Modules.AccountsReceivable.Application.Queries.GetCustomerBalance;

public record GetCustomerBalanceQuery(Guid CustomerId) : IQuery<CustomerBalanceDto>;
