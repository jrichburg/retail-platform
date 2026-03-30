using Microsoft.EntityFrameworkCore;
using Infrastructure.Persistence;
using Modules.Customers.Domain.Entities;
using SharedKernel;
using SharedKernel.Application;

namespace Modules.Customers.Application.Commands.CreateCustomer;

public class CreateCustomerCommandHandler : ICommandHandler<CreateCustomerCommand, Guid>
{
    private readonly AppDbContext _db;
    private readonly ITenantContext _tenantContext;

    public CreateCustomerCommandHandler(AppDbContext db, ITenantContext tenantContext)
    {
        _db = db;
        _tenantContext = tenantContext;
    }

    public async Task<Result<Guid>> Handle(CreateCustomerCommand request, CancellationToken cancellationToken)
    {
        if (!string.IsNullOrWhiteSpace(request.Email))
        {
            var emailExists = await _db.Set<Customer>()
                .AnyAsync(c => c.Email == request.Email, cancellationToken);
            if (emailExists)
                return Result.Failure<Guid>($"A customer with email '{request.Email}' already exists.");
        }

        var customer = new Customer
        {
            FirstName = request.FirstName,
            LastName = request.LastName,
            Email = request.Email,
            Phone = request.Phone,
            Street = request.Street,
            City = request.City,
            State = request.State,
            Zip = request.Zip,
            Notes = request.Notes,
            IsActive = true,
            TenantNodeId = _tenantContext.TenantNodeId,
            RootTenantId = _tenantContext.RootTenantId,
        };

        _db.Set<Customer>().Add(customer);
        await _db.SaveChangesAsync(cancellationToken);
        return Result.Success(customer.Id);
    }
}
