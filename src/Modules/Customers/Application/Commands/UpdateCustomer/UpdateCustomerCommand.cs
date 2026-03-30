using SharedKernel.Application;

namespace Modules.Customers.Application.Commands.UpdateCustomer;

public record UpdateCustomerCommand(
    Guid Id,
    string FirstName,
    string LastName,
    string? Email,
    string? Phone,
    string? Street,
    string? City,
    string? State,
    string? Zip,
    string? Notes,
    bool IsActive
) : ICommand;
