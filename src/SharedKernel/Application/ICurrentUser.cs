namespace SharedKernel.Application;

public interface ICurrentUser
{
    Guid UserId { get; }
    string Email { get; }
    IReadOnlyList<string> Roles { get; }
    IReadOnlyList<string> Permissions { get; }
}
