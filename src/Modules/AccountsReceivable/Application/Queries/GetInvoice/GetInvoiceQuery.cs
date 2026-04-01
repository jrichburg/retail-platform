using SharedKernel.Application;
using Modules.AccountsReceivable.Application.Dtos;

namespace Modules.AccountsReceivable.Application.Queries.GetInvoice;

public record GetInvoiceQuery(Guid Id) : IQuery<InvoiceDetailDto>;
