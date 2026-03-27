using FluentValidation;

namespace Modules.Catalog.Application.Commands.CreateSizeGrid;

public class CreateSizeGridCommandValidator : AbstractValidator<CreateSizeGridCommand>
{
    public CreateSizeGridCommandValidator()
    {
        RuleFor(x => x.Name).NotEmpty().MaximumLength(200);
        RuleFor(x => x.Dimension1Label).NotEmpty().MaximumLength(50);
        RuleFor(x => x.Dimension2Label).MaximumLength(50);
        RuleFor(x => x.Values).NotEmpty().WithMessage("At least one size value is required.");
        RuleForEach(x => x.Values).ChildRules(v =>
        {
            v.RuleFor(x => x.Dimension).InclusiveBetween(1, 2);
            v.RuleFor(x => x.Value).NotEmpty().MaximumLength(20);
        });
    }
}
