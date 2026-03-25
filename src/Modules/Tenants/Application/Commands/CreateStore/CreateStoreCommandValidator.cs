using FluentValidation;

namespace Modules.Tenants.Application.Commands.CreateStore;

public class CreateStoreCommandValidator : AbstractValidator<CreateStoreCommand>
{
    public CreateStoreCommandValidator()
    {
        RuleFor(x => x.Name).NotEmpty().MaximumLength(200);
        RuleFor(x => x.Code).NotEmpty().MaximumLength(20)
            .Matches("^[a-zA-Z0-9_-]+$").WithMessage("Code must be alphanumeric.");
        RuleFor(x => x.ParentId).NotEmpty();
    }
}
