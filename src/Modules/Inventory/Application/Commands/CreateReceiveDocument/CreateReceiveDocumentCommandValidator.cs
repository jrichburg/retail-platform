using FluentValidation;

namespace Modules.Inventory.Application.Commands.CreateReceiveDocument;

public class CreateReceiveDocumentCommandValidator : AbstractValidator<CreateReceiveDocumentCommand>
{
    public CreateReceiveDocumentCommandValidator()
    {
        RuleFor(x => x.Lines).NotEmpty().WithMessage("At least one item is required.");
        RuleForEach(x => x.Lines).ChildRules(line =>
        {
            line.RuleFor(x => x.ProductId).NotEmpty();
            line.RuleFor(x => x.ProductName).NotEmpty();
            line.RuleFor(x => x.Sku).NotEmpty();
            line.RuleFor(x => x.Quantity).GreaterThan(0);
        });
    }
}
