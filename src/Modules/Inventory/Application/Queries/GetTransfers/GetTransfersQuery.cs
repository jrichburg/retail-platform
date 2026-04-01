using Modules.Inventory.Application.Dtos;
using SharedKernel;
using SharedKernel.Application;

namespace Modules.Inventory.Application.Queries.GetTransfers;

public record GetTransfersQuery(int Page = 1, int PageSize = 25, string? Status = null)
    : IQuery<PagedResult<TransferDocumentDto>>;
