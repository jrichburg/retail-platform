using SharedKernel.Application;
using Modules.Inventory.Application.Dtos;

namespace Modules.Inventory.Application.Queries.GetReceiveDocuments;

public record GetReceiveDocumentsQuery(int Page = 1, int PageSize = 25) : IQuery<PagedResult<ReceiveDocumentDto>>;
