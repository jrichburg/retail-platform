using Microsoft.EntityFrameworkCore;
using Infrastructure.Persistence;
using Modules.Customers.Application.Dtos;
using Modules.Customers.Domain.Entities;
using SharedKernel;
using SharedKernel.Application;

namespace Modules.Customers.Application.Queries.GetCustomer;

public class GetCustomerQueryHandler : IQueryHandler<GetCustomerQuery, CustomerDto>
{
    private readonly AppDbContext _db;

    public GetCustomerQueryHandler(AppDbContext db)
    {
        _db = db;
    }

    public async Task<Result<CustomerDto>> Handle(GetCustomerQuery request, CancellationToken cancellationToken)
    {
        var customer = await _db.Set<Customer>()
            .AsNoTracking()
            .Where(c => c.Id == request.Id)
            .Select(c => new CustomerDto
            {
                Id = c.Id,
                FirstName = c.FirstName,
                LastName = c.LastName,
                Email = c.Email,
                Phone = c.Phone,
                Street = c.Street,
                City = c.City,
                State = c.State,
                Zip = c.Zip,
                Notes = c.Notes,
                IsActive = c.IsActive,
                CreatedAt = c.CreatedAt,
            })
            .FirstOrDefaultAsync(cancellationToken);

        if (customer == null) return Result.Failure<CustomerDto>("Customer not found.");
        return Result.Success(customer);
    }
}
