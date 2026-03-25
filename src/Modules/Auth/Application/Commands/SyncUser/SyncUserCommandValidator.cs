using FluentValidation;

namespace Modules.Auth.Application.Commands.SyncUser;

public class SyncUserCommandValidator : AbstractValidator<SyncUserCommand>
{
    public SyncUserCommandValidator()
    {
        RuleFor(x => x.SupabaseUserId).NotEmpty();
        RuleFor(x => x.Email).NotEmpty().EmailAddress();
        RuleFor(x => x.TenantNodeId).NotEmpty();
        RuleFor(x => x.RootTenantId).NotEmpty();
    }
}
