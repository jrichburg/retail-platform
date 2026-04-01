using SharedKernel.Application;

namespace Modules.AccountsReceivable.Application.Commands.RecordPayment;

public record RecordPaymentCommand(
    Guid InvoiceId,
    decimal Amount,
    string PaymentMethod,
    DateTime PaymentDate,
    string? Reference,
    string? Notes
) : ICommand<Guid>;
