using FluentValidation;

namespace Modules.Inventory.Application.Commands.ReceiveAgainstPO;

public class ReceiveAgainstPOCommandValidator : AbstractValidator<ReceiveAgainstPOCommand>
{
    public ReceiveAgainstPOCommandValidator()
    {
        RuleFor(x => x.PurchaseOrderId).NotEmpty();
        RuleFor(x => x.Lines).NotEmpty();
        RuleForEach(x => x.Lines).ChildRules(line =>
        {
            line.RuleFor(x => x.ProductId).NotEmpty();
            line.RuleFor(x => x.Quantity).GreaterThan(0);
        });
    }
}
