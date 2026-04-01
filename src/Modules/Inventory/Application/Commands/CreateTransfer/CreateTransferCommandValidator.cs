using FluentValidation;

namespace Modules.Inventory.Application.Commands.CreateTransfer;

public class CreateTransferCommandValidator : AbstractValidator<CreateTransferCommand>
{
    public CreateTransferCommandValidator()
    {
        RuleFor(x => x.DestinationTenantNodeId).NotEmpty().WithMessage("Destination store is required.");
        RuleFor(x => x.Lines).NotEmpty().WithMessage("At least one item is required.");
        RuleForEach(x => x.Lines).ChildRules(line =>
        {
            line.RuleFor(l => l.ProductId).NotEmpty();
            line.RuleFor(l => l.ProductName).NotEmpty();
            line.RuleFor(l => l.Sku).NotEmpty();
            line.RuleFor(l => l.Quantity).GreaterThan(0).WithMessage("Quantity must be greater than zero.");
        });
    }
}
