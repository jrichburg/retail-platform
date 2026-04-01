using Modules.Inventory.Application.Dtos;
using SharedKernel.Application;

namespace Modules.Inventory.Application.Queries.GetTransfer;

public record GetTransferQuery(Guid Id) : IQuery<TransferDocumentDetailDto>;
