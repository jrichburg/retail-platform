using System.Net.Http.Json;
using System.Text.Json;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using SharedKernel.Application;

namespace Infrastructure.Services.Payments;

public class FullsteamPaymentService : IPaymentService
{
    private readonly HttpClient _httpClient;
    private readonly ILogger<FullsteamPaymentService> _logger;
    private readonly FullsteamOptions _options;

    public FullsteamPaymentService(HttpClient httpClient, ILogger<FullsteamPaymentService> logger, IConfiguration configuration)
    {
        _httpClient = httpClient;
        _logger = logger;
        _options = new FullsteamOptions();
        configuration.GetSection("Fullsteam").Bind(_options);
    }

    public async Task<PaymentResult> AuthorizeAsync(PaymentRequest request, CancellationToken cancellationToken = default)
    {
        if (string.IsNullOrEmpty(_options.ApiUrl))
        {
            _logger.LogWarning("Fullsteam API URL not configured. Returning simulated approval for development.");
            return PaymentResult.Success(
                approvalCode: $"SIM{Random.Shared.Next(100000, 999999)}",
                last4: "4242",
                cardType: "Visa",
                processorResponse: JsonSerializer.Serialize(new { simulated = true })
            );
        }

        try
        {
            var payload = new
            {
                merchantId = _options.MerchantId,
                terminalId = request.TerminalId ?? _options.TerminalId,
                amount = request.Amount,
                currency = request.Currency,
                idempotencyKey = request.IdempotencyKey,
            };

            var response = await _httpClient.PostAsJsonAsync(
                $"{_options.ApiUrl}/transactions/authorize",
                payload,
                cancellationToken);

            if (response.IsSuccessStatusCode)
            {
                var result = await response.Content.ReadFromJsonAsync<FullsteamAuthResponse>(cancellationToken: cancellationToken);
                return PaymentResult.Success(
                    result?.ApprovalCode ?? "UNKNOWN",
                    result?.Last4,
                    result?.CardType,
                    await response.Content.ReadAsStringAsync(cancellationToken));
            }

            var errorBody = await response.Content.ReadAsStringAsync(cancellationToken);
            _logger.LogWarning("Fullsteam authorization failed: {StatusCode} {Body}", response.StatusCode, errorBody);
            return PaymentResult.Failure($"Payment declined: {response.StatusCode}");
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Fullsteam payment error");
            return PaymentResult.Failure($"Payment processing error: {ex.Message}");
        }
    }
}

public class FullsteamOptions
{
    public string? ApiUrl { get; set; }
    public string? MerchantId { get; set; }
    public string? ApiKey { get; set; }
    public string? TerminalId { get; set; }
}

internal class FullsteamAuthResponse
{
    public string? ApprovalCode { get; set; }
    public string? Last4 { get; set; }
    public string? CardType { get; set; }
}
