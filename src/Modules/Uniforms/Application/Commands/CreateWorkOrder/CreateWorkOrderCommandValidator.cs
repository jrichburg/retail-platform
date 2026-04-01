using FluentValidation;

namespace Modules.Uniforms.Application.Commands.CreateWorkOrder;

public class CreateWorkOrderCommandValidator : AbstractValidator<CreateWorkOrderCommand>
{
    public CreateWorkOrderCommandValidator()
    {
        RuleFor(x => x.CustomerId).NotEmpty();
        RuleFor(x => x.CustomerName).NotEmpty();
        RuleFor(x => x.Lines).NotEmpty().WithMessage("At least one line item is required.");
        RuleForEach(x => x.Lines).ChildRules(line =>
        {
            line.RuleFor(x => x.Description).NotEmpty();
            line.RuleFor(x => x.Quantity).GreaterThan(0);
            line.RuleFor(x => x.UnitPrice).GreaterThanOrEqualTo(0);
        });
    }
}
