using FluentValidation;

namespace Modules.Sales.Application.Commands.CreateSale;

public class CreateSaleCommandValidator : AbstractValidator<CreateSaleCommand>
{
    public CreateSaleCommandValidator()
    {
        RuleFor(x => x.Items).NotEmpty().WithMessage("At least one item is required.");
        RuleForEach(x => x.Items).ChildRules(item =>
        {
            item.RuleFor(i => i.ProductId).NotEmpty();
            item.RuleFor(i => i.Quantity).GreaterThan(0);
        });
        RuleFor(x => x.Tenders).NotEmpty().WithMessage("At least one tender is required.");
        RuleForEach(x => x.Tenders).ChildRules(tender =>
        {
            tender.RuleFor(t => t.TenderType).NotEmpty();
            tender.RuleFor(t => t.Amount).GreaterThan(0);
        });
    }
}
