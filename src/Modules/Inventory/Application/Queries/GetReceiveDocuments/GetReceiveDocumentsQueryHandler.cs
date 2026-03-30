using Microsoft.EntityFrameworkCore;
using Infrastructure.Persistence;
using Modules.Inventory.Application.Dtos;
using Modules.Inventory.Domain.Entities;
using SharedKernel;
using SharedKernel.Application;

namespace Modules.Inventory.Application.Queries.GetReceiveDocuments;

public class GetReceiveDocumentsQueryHandler : IQueryHandler<GetReceiveDocumentsQuery, PagedResult<ReceiveDocumentDto>>
{
    private readonly AppDbContext _db;

    public GetReceiveDocumentsQueryHandler(AppDbContext db)
    {
        _db = db;
    }

    public async Task<Result<PagedResult<ReceiveDocumentDto>>> Handle(GetReceiveDocumentsQuery request, CancellationToken cancellationToken)
    {
        var query = _db.Set<ReceiveDocument>()
            .AsNoTracking()
            .Include(d => d.Lines)
            .OrderByDescending(d => d.CreatedAt);

        var totalCount = await query.CountAsync(cancellationToken);
        var items = await query
            .Skip((request.Page - 1) * request.PageSize)
            .Take(request.PageSize)
            .Select(d => new ReceiveDocumentDto
            {
                Id = d.Id,
                DocumentNumber = d.DocumentNumber,
                PurchaseOrderId = d.PurchaseOrderId,
                Status = d.Status,
                Notes = d.Notes,
                LineCount = d.Lines.Count,
                TotalUnits = d.Lines.Sum(l => l.Quantity),
                CreatedAt = d.CreatedAt,
            })
            .ToListAsync(cancellationToken);

        return Result.Success(new PagedResult<ReceiveDocumentDto>
        {
            Items = items,
            TotalCount = totalCount,
            Page = request.Page,
            PageSize = request.PageSize,
        });
    }
}
