using Microsoft.EntityFrameworkCore;
using Infrastructure.Persistence;
using Modules.Inventory.Application.Dtos;
using Modules.Inventory.Domain.Entities;
using SharedKernel;
using SharedKernel.Application;

namespace Modules.Inventory.Application.Queries.GetReceiveDocument;

public class GetReceiveDocumentQueryHandler : IQueryHandler<GetReceiveDocumentQuery, ReceiveDocumentDetailDto>
{
    private readonly AppDbContext _db;

    public GetReceiveDocumentQueryHandler(AppDbContext db)
    {
        _db = db;
    }

    public async Task<Result<ReceiveDocumentDetailDto>> Handle(GetReceiveDocumentQuery request, CancellationToken cancellationToken)
    {
        var doc = await _db.Set<ReceiveDocument>()
            .AsNoTracking()
            .Include(d => d.Lines)
            .Where(d => d.Id == request.Id)
            .Select(d => new ReceiveDocumentDetailDto
            {
                Id = d.Id,
                DocumentNumber = d.DocumentNumber,
                PurchaseOrderId = d.PurchaseOrderId,
                Status = d.Status,
                Notes = d.Notes,
                CreatedAt = d.CreatedAt,
                Lines = d.Lines.Select(l => new ReceiveDocumentLineDto
                {
                    Id = l.Id,
                    ProductId = l.ProductId,
                    ProductVariantId = l.ProductVariantId,
                    ProductName = l.ProductName,
                    Sku = l.Sku,
                    Upc = l.Upc,
                    VariantDescription = l.VariantDescription,
                    Quantity = l.Quantity,
                }).ToList(),
            })
            .FirstOrDefaultAsync(cancellationToken);

        if (doc == null)
            return Result.Failure<ReceiveDocumentDetailDto>("Receive document not found.");

        return Result.Success(doc);
    }
}
