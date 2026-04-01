using SharedKernel.Application;

namespace Modules.Inventory.Application.Commands.SubmitTransfer;

public record SubmitTransferCommand(Guid TransferDocumentId) : ICommand;
