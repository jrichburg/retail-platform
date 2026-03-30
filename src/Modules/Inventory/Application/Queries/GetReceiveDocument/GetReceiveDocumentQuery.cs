using SharedKernel.Application;
using Modules.Inventory.Application.Dtos;

namespace Modules.Inventory.Application.Queries.GetReceiveDocument;

public record GetReceiveDocumentQuery(Guid Id) : IQuery<ReceiveDocumentDetailDto>;
