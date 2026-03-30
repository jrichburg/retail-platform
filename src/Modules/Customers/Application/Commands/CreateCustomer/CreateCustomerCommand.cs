using SharedKernel.Application;

namespace Modules.Customers.Application.Commands.CreateCustomer;

public record CreateCustomerCommand(
    string FirstName,
    string LastName,
    string? Email,
    string? Phone,
    string? Street,
    string? City,
    string? State,
    string? Zip,
    string? Notes
) : ICommand<Guid>;
