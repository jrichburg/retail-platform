using SharedKernel.Application;

namespace Modules.Inventory.Application.Commands.CompleteTransfer;

public record CompleteTransferCommand(Guid TransferDocumentId) : ICommand;
