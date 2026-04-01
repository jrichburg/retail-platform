using SharedKernel.Application;
using Modules.AccountsReceivable.Application.Dtos;

namespace Modules.AccountsReceivable.Application.Queries.GetInvoices;

public record GetInvoicesQuery(int Page = 1, int PageSize = 25, string? Status = null, Guid? CustomerId = null) : IQuery<PagedResult<InvoiceDto>>;
