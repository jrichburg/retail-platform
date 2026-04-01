using Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;
using Modules.Inventory.Application.Dtos;
using Modules.Inventory.Domain.Entities;
using Modules.Tenants.Domain.Entities;
using SharedKernel;
using SharedKernel.Application;

namespace Modules.Inventory.Application.Queries.GetTransfer;

public class GetTransferQueryHandler : IQueryHandler<GetTransferQuery, TransferDocumentDetailDto>
{
    private readonly AppDbContext _db;

    public GetTransferQueryHandler(AppDbContext db)
    {
        _db = db;
    }

    public async Task<Result<TransferDocumentDetailDto>> Handle(GetTransferQuery request, CancellationToken cancellationToken)
    {
        var document = await _db.Set<TransferDocument>()
            .Include(d => d.Lines)
            .AsNoTracking()
            .FirstOrDefaultAsync(d => d.Id == request.Id, cancellationToken);

        if (document == null)
            return Result.Failure<TransferDocumentDetailDto>("Transfer document not found.");

        var storeIds = new[] { document.SourceTenantNodeId, document.DestinationTenantNodeId };
        var storeNames = await _db.Set<TenantNode>()
            .IgnoreQueryFilters()
            .Where(t => storeIds.Contains(t.Id))
            .AsNoTracking()
            .ToDictionaryAsync(t => t.Id, t => t.Name, cancellationToken);

        var dto = new TransferDocumentDetailDto
        {
            Id = document.Id,
            DocumentNumber = document.DocumentNumber,
            SourceTenantNodeId = document.SourceTenantNodeId,
            SourceStoreName = storeNames.GetValueOrDefault(document.SourceTenantNodeId, "Unknown"),
            DestinationTenantNodeId = document.DestinationTenantNodeId,
            DestinationStoreName = storeNames.GetValueOrDefault(document.DestinationTenantNodeId, "Unknown"),
            Status = document.Status,
            Notes = document.Notes,
            CreatedAt = document.CreatedAt,
            Lines = document.Lines.Select(l => new TransferDocumentLineDto
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
        };

        return Result.Success(dto);
    }
}
