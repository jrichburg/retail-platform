using Microsoft.EntityFrameworkCore;
using Infrastructure.Persistence;
using Modules.Customers.Domain.Entities;
using SharedKernel;
using SharedKernel.Application;

namespace Modules.Customers.Application.Commands.UpdateCustomer;

public class UpdateCustomerCommandHandler : ICommandHandler<UpdateCustomerCommand>
{
    private readonly AppDbContext _db;

    public UpdateCustomerCommandHandler(AppDbContext db)
    {
        _db = db;
    }

    public async Task<Result> Handle(UpdateCustomerCommand request, CancellationToken cancellationToken)
    {
        var customer = await _db.Set<Customer>()
            .FirstOrDefaultAsync(c => c.Id == request.Id, cancellationToken);
        if (customer == null) return Result.Failure("Customer not found.");

        if (!string.IsNullOrWhiteSpace(request.Email) && customer.Email != request.Email)
        {
            var emailExists = await _db.Set<Customer>()
                .AnyAsync(c => c.Email == request.Email && c.Id != request.Id, cancellationToken);
            if (emailExists) return Result.Failure($"A customer with email '{request.Email}' already exists.");
        }

        customer.FirstName = request.FirstName;
        customer.LastName = request.LastName;
        customer.Email = request.Email;
        customer.Phone = request.Phone;
        customer.Street = request.Street;
        customer.City = request.City;
        customer.State = request.State;
        customer.Zip = request.Zip;
        customer.Notes = request.Notes;
        customer.IsActive = request.IsActive;

        await _db.SaveChangesAsync(cancellationToken);
        return Result.Success();
    }
}
