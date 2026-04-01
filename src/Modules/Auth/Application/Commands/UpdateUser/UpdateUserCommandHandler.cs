using Microsoft.EntityFrameworkCore;
using Infrastructure.Persistence;
using Modules.Auth.Domain.Entities;
using SharedKernel;
using SharedKernel.Application;

namespace Modules.Auth.Application.Commands.UpdateUser;

public class UpdateUserCommandHandler : ICommandHandler<UpdateUserCommand>
{
    private readonly AppDbContext _db;

    public UpdateUserCommandHandler(AppDbContext db)
    {
        _db = db;
    }

    public async Task<Result> Handle(UpdateUserCommand request, CancellationToken cancellationToken)
    {
        var user = await _db.Set<AppUser>()
            .FirstOrDefaultAsync(u => u.Id == request.Id, cancellationToken);

        if (user == null) return Result.Failure("User not found.");

        user.FirstName = request.FirstName;
        user.LastName = request.LastName;
        user.IsActive = request.IsActive;

        await _db.SaveChangesAsync(cancellationToken);
        return Result.Success();
    }
}
