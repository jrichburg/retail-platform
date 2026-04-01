using SharedKernel.Application;

namespace Modules.AccountsReceivable.Application.Commands.CreateInvoice;

public record CreateInvoiceCommand(
    Guid CustomerId,
    string CustomerName,
    string? SourceType,
    Guid? SourceId,
    string? SourceReference,
    decimal Amount,
    DateTime DueDate,
    string? Notes
) : ICommand<Guid>;
