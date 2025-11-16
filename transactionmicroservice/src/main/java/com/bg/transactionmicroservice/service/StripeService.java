package com.bg.transactionmicroservice.service;

import com.bg.transactionmicroservice.client.UserClient;
import com.bg.transactionmicroservice.entity.ClientDTO;
import com.bg.transactionmicroservice.entity.Transaction;
import com.bg.usermicroservice.grpc.UpdateStripeIdRequest;
import com.stripe.Stripe;
import com.stripe.exception.SignatureVerificationException;
import com.stripe.exception.StripeException;
import com.stripe.model.*;
import com.stripe.net.Webhook;
import com.stripe.param.AccountCreateParams;
import com.stripe.param.AccountLinkCreateParams;
import com.stripe.param.PaymentIntentCreateParams;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.util.Map;

@Service
public class StripeService {

    private static final Logger log = LoggerFactory.getLogger(StripeService.class);

    private final TransactionService transactionService;

    private final UserClient userClient;

    @Value("${stripe.secret.key}")
    private String stripeSecretKey;

    @Value("${stripe.webhook.secret}")
    private String stripeWebhookSecret;

    public StripeService(TransactionService transactionService, UserClient userClient) {
        this.transactionService = transactionService;
        this.userClient = userClient;
    }

    /**
     * Webhook handler
     * @param payload the payload
     * @param sigHeader the signature header
     * @throws Exception an exception
     */
    public void handleWebhookEvent(String payload, String sigHeader) throws Exception {
        Event event;

        // check the webhook
        try {
            Stripe.apiKey = stripeSecretKey; // Must set API key for the deserialization process
            event = Webhook.constructEvent(payload, sigHeader, stripeWebhookSecret);
        } catch (SignatureVerificationException e) {
            throw new RuntimeException("Webhook signature verification failed.", e);
        }

        StripeObject dataObject = event.getDataObjectDeserializer().getObject()
                .orElseThrow(() -> new RuntimeException("Could not deserialize object from webhook."));

        switch (event.getType()) {
            case "account.updated":
                processAccountUpdated(event);
                break;
            case "payment_intent.payment_created":
                processPaymentIntentCreated((PaymentIntent) dataObject);
                break;
            case "payment_intent.succeeded":
                processPaymentIntentSucceeded((PaymentIntent) dataObject);
                break;
            case "payment_intent.payment_failed":
                processPaymentIntentFailed((PaymentIntent) dataObject);
                break;
            case "charge.succeeded":
                processChargeSucceeded((Charge) dataObject);
                break;
            default:
                System.out.println("Received unhandled event type: " + event.getType());
                break;
        }
    }

    /**
     * Helper for account updates Event success webhook
     * @param event the Event
     */
    private void processAccountUpdated(Event event) {
        Account account = (Account) event.getDataObjectDeserializer().getObject()
                .orElseThrow(() -> new RuntimeException("Could not deserialize Account object from webhook."));

        // seller stripe id
        String stripeAccountId = account.getId();

        // seller id in my database
        String internalSellerId = account.getMetadata().get("internal_seller_id");

        if (internalSellerId == null) {
            throw new RuntimeException("Webhook 'account.updated' received but missing 'internal_seller_id' in metadata.");
        }

        // stripeId changed, save it to Client database
        UpdateStripeIdRequest request = UpdateStripeIdRequest.newBuilder()
                .setClientId(internalSellerId)
                .setStripeId(stripeAccountId)
                .build();

        userClient.updateStripeId(request);
    }

    /**
     * Helper to process the PaymentIntentCreated event
     * @param paymentIntent the PaymentIntent
     */
    private void processPaymentIntentCreated(PaymentIntent paymentIntent) {
        String internalTransactionId = paymentIntent.getMetadata().get("platform_transaction_id");
        if (internalTransactionId != null) {
            log.info("PaymentIntent {} created. Transaction {} is initiated.", paymentIntent.getId(), internalTransactionId);
            // transactionService.updateTransactionStatus(internalTransactionId, "PROCESSING");
        } else {
            log.warn("PaymentIntent {} created but is missing 'platform_transaction_id' metadata.", paymentIntent.getId());
        }
    }

    /**
     * Helper for PaymentIntent success webhook
     * @param paymentIntent the PaymentIntent
     */
    private void processPaymentIntentSucceeded(PaymentIntent paymentIntent) {
        String internalTransactionId = paymentIntent.getMetadata().get("platform_transaction_id");
        if (internalTransactionId == null) {
            log.error("PaymentIntent {} succeeded but is missing 'platform_transaction_id' metadata.", paymentIntent.getId());
            return;
        }
        Transaction transaction = new Transaction();
        transaction.setTransactionId(internalTransactionId);
        transaction.setPaymentMethodId(paymentIntent.getMetadata().get("payment_method_id"));
        transaction.setStripePaymentIntentId(paymentIntent.getMetadata().get("stripe_payment_intent_id"));
        //transactionService.updateStripeData(transaction);
        //transactionService.updateTransactionToCompleted(internalTransactionId, true);
        log.info("PaymentIntent {} successful. Transaction {} fulfilled.", paymentIntent.getId(), internalTransactionId);
    }

    /**
     * Helper for PaymentIntent fail webhook
     * @param paymentIntent the PaymentIntent
     */
    private void processPaymentIntentFailed(PaymentIntent paymentIntent) {
        String internalTransactionId = paymentIntent.getMetadata().get("platform_transaction_id");
        if (internalTransactionId == null) {
            log.error("PaymentIntent {} failed but is missing 'platform_transaction_id' metadata.", paymentIntent.getId());
            return;
        }
        transactionService.updateTransactionToCompleted(internalTransactionId, false);
        log.warn("PaymentIntent {} failed. Transaction {} marked as failed.", paymentIntent.getId(), internalTransactionId);
    }

    /**
     * Helper to process ChargeSucceeded
     * @param charge the Charge
     */
    private void processChargeSucceeded(Charge charge) {
        String paymentIntentId = charge.getPaymentIntent();
        log.info("Charge {} succeeded. PaymentIntent ID: {}. (Note: payment_intent.succeeded is usually preferred)", charge.getId(), paymentIntentId);
    }

    /**
     * Creates a seller's ConnectedAccount
     * @param clientDTO a ClientDTO
     * @return a Map<String,String> with the stripe account id
     */
    public Map<String, String> createConnectedAccount(ClientDTO clientDTO) {
        Stripe.apiKey = stripeSecretKey;
        try {
            // 1. Define the parameters for the new Connected Account
            AccountCreateParams params = AccountCreateParams.builder()
                    .setType(AccountCreateParams.Type.EXPRESS) // Recommended for marketplaces
                    .setCountry("FR") // Change to your supported country
                    .setEmail(clientDTO.getEmail())
                    .putMetadata("internal_seller_id", clientDTO.getClientId())

                    // Define capabilities needed (transfer and card payments)
                    .setCapabilities(
                            AccountCreateParams.Capabilities.builder()
                                    .setCardPayments(
                                            // Requesting the ability to process card payments
                                            AccountCreateParams.Capabilities.CardPayments.builder()
                                                    .setRequested(true)
                                                    .build()
                                    )
                                    .setTransfers(
                                            // Requesting the ability to receive transfers from your platform
                                            AccountCreateParams.Capabilities.Transfers.builder()
                                                    .setRequested(true)
                                                    .build()
                                    )
                                    .build()
                    )
                    .build();

            // 2. Call the Stripe API
            Account account = Account.create(params);

            // 3. Save the temporary Stripe Account ID immediately (optional, but recommended)
            // You'll update this record later when the 'account.updated' webhook hits.
            // updateSellerWithStripeId(internalSellerId, account.getId());

            // 4. Return the new Stripe Account ID to the controller
            return Map.of("stripeAccountId", account.getId());
        } catch (StripeException e) {
            throw new RuntimeException("Failed to create Stripe Connected Account: " + e.getMessage(), e);
        }
    }

    /**
     * Creates an Account Link URL to redirect the seller to the Stripe onboarding flow.
     * @param stripeAccountId The 'acct_...' ID returned from createConnectedAccount.
     * @return A Map<String, String> containing the 'accountLinkUrl'.
     */
    public Map<String, String> createAccountLink(String stripeAccountId) {
        Stripe.apiKey = stripeSecretKey;
        // Define the URLs where Stripe should send the user after interaction.
        // NOTE: These must be actual public URLs your frontend can handle.
        final String RETURN_URL = "tbd";
        final String REFRESH_URL = "tbd";

        try {
            // 1. Define the parameters for the Account Link
            AccountLinkCreateParams params = AccountLinkCreateParams.builder()
                    .setAccount(stripeAccountId)
                    .setRefreshUrl(REFRESH_URL)
                    .setReturnUrl(RETURN_URL)
                    .setType(AccountLinkCreateParams.Type.ACCOUNT_ONBOARDING) // Specifies this is for initial onboarding
                    .build();

            // 2. Call the Stripe API
            AccountLink accountLink = AccountLink.create(params);

            log.info("Successfully created account link URL for Stripe Account {}.", stripeAccountId);

            // 3. Return the URL for the controller to send back to the frontend
            return Map.of("accountLinkUrl", accountLink.getUrl());

        } catch (StripeException e) {
            log.error("Failed to create Stripe Account Link for account {}.", stripeAccountId, e);
            throw new RuntimeException("Failed to create Stripe Account Link: " + e.getMessage(), e);
        }
    }

    /**
     * Creates a PaymentIntent with a Destination Charge.
     * Charges the buyer and transfers the net amount to the seller, holding the application fee.
     * @param amountInCents The total amount to charge the customer (in cents).
     * @param sellerStripeAccountId The connected account ID of the seller.
     * @param paymentMethodId The ID of the buyer's PaymentMethod.
     * @param applicationFeeAmountInCents The commission amount for the platform (in cents).
     * @return The created Stripe PaymentIntent object.
     */
    public PaymentIntent createDestinationPaymentIntent(long amountInCents, String sellerStripeAccountId, String paymentMethodId, long applicationFeeAmountInCents, String platformTransactionId) throws StripeException {
        Stripe.apiKey = stripeSecretKey;

        PaymentIntentCreateParams params = PaymentIntentCreateParams.builder()
                .setCurrency("eur") // Change to your currency
                .setAmount(amountInCents)
                .setPaymentMethod(paymentMethodId)
                .setOffSession(false)
                .setConfirm(true)
                .setAutomaticPaymentMethods(
                        PaymentIntentCreateParams.AutomaticPaymentMethods.builder()
                                .setEnabled(true)
                                .build()
                )
                // 1. Destination Charge: Transfer the total amount to the seller's account.
                .setTransferData(
                        PaymentIntentCreateParams.TransferData.builder()
                                .setDestination(sellerStripeAccountId)
                                .build()
                )
                // 2. Application Fee: This is the platform's commission, deducted from the transfer.
                .setApplicationFeeAmount(applicationFeeAmountInCents)
                // 3. Metadata for easy tracking
                .putMetadata("platform_transaction_id", platformTransactionId)
                .build();

        return PaymentIntent.create(params);
    }
}
