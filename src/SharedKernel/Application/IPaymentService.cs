namespace SharedKernel.Application;

public interface IPaymentService
{
    Task<PaymentResult> AuthorizeAsync(PaymentRequest request, CancellationToken cancellationToken = default);
}

public class PaymentRequest
{
    public decimal Amount { get; set; }
    public string Currency { get; set; } = "USD";
    public string IdempotencyKey { get; set; } = string.Empty;
    public string? TerminalId { get; set; }
}

public class PaymentResult
{
    public bool IsSuccess { get; set; }
    public string? ApprovalCode { get; set; }
    public string? Last4 { get; set; }
    public string? CardType { get; set; }
    public string? ErrorMessage { get; set; }
    public string? ProcessorResponse { get; set; } // JSON

    public static PaymentResult Success(string approvalCode, string? last4, string? cardType, string? processorResponse) =>
        new() { IsSuccess = true, ApprovalCode = approvalCode, Last4 = last4, CardType = cardType, ProcessorResponse = processorResponse };

    public static PaymentResult Failure(string errorMessage) =>
        new() { IsSuccess = false, ErrorMessage = errorMessage };
}
