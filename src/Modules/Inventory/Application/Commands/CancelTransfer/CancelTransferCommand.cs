using SharedKernel.Application;

namespace Modules.Inventory.Application.Commands.CancelTransfer;

public record CancelTransferCommand(Guid TransferDocumentId) : ICommand;
