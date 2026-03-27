using FluentValidation;

namespace Modules.Catalog.Application.Commands.CreateProduct;

public class CreateProductCommandValidator : AbstractValidator<CreateProductCommand>
{
    public CreateProductCommandValidator()
    {
        RuleFor(x => x.Name).NotEmpty().MaximumLength(200);
        RuleFor(x => x.Sku).NotEmpty().MaximumLength(50);
        RuleFor(x => x.CategoryId).NotEmpty();
        RuleFor(x => x.RetailPrice).GreaterThan(0);
        RuleFor(x => x.CostPrice).GreaterThanOrEqualTo(0).When(x => x.CostPrice.HasValue);
        RuleFor(x => x.Color).MaximumLength(50);
        RuleForEach(x => x.Variants).ChildRules(v =>
        {
            v.RuleFor(x => x.Upc).MaximumLength(50);
        });
    }
}
