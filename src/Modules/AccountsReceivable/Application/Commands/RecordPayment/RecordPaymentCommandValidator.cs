using FluentValidation;

namespace Modules.AccountsReceivable.Application.Commands.RecordPayment;

public class RecordPaymentCommandValidator : AbstractValidator<RecordPaymentCommand>
{
    private static readonly string[] ValidMethods = { "cash", "card", "check", "other" };

    public RecordPaymentCommandValidator()
    {
        RuleFor(x => x.InvoiceId).NotEmpty();
        RuleFor(x => x.Amount).GreaterThan(0);
        RuleFor(x => x.PaymentMethod)
            .Must(m => ValidMethods.Contains(m))
            .WithMessage("Payment method must be 'cash', 'card', 'check', or 'other'.");
        RuleFor(x => x.PaymentDate).NotEmpty();
    }
}
