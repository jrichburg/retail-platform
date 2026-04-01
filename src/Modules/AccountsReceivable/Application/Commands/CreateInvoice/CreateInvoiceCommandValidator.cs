using FluentValidation;

namespace Modules.AccountsReceivable.Application.Commands.CreateInvoice;

public class CreateInvoiceCommandValidator : AbstractValidator<CreateInvoiceCommand>
{
    private static readonly string[] ValidSourceTypes = { "sale", "work_order", "manual" };

    public CreateInvoiceCommandValidator()
    {
        RuleFor(x => x.CustomerId).NotEmpty();
        RuleFor(x => x.CustomerName).NotEmpty();
        RuleFor(x => x.Amount).GreaterThan(0);
        RuleFor(x => x.DueDate).NotEmpty();
        RuleFor(x => x.SourceType)
            .Must(s => s == null || ValidSourceTypes.Contains(s))
            .WithMessage("Source type must be 'sale', 'work_order', or 'manual'.");
    }
}
