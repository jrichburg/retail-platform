using SharedKernel.Application;
using Modules.AccountsReceivable.Application.Dtos;

namespace Modules.AccountsReceivable.Application.Queries.GetPayments;

public record GetPaymentsQuery(int Page = 1, int PageSize = 25, Guid? CustomerId = null, Guid? InvoiceId = null) : IQuery<PagedResult<PaymentDto>>;
