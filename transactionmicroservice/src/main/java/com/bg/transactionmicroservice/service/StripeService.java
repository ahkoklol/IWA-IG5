package com.bg.transactionmicroservice.service;

import com.bg.transactionmicroservice.entity.ClientDTO;
import com.stripe.Stripe;
import com.stripe.exception.SignatureVerificationException;
import com.stripe.exception.StripeException;
import com.stripe.model.Account;
import com.stripe.model.AccountLink;
import com.stripe.model.Event;
import com.stripe.net.Webhook;
import com.stripe.param.AccountCreateParams;
import com.stripe.param.AccountLinkCreateParams;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.util.Map;

@Service
public class StripeService {

    private static final Logger log = LoggerFactory.getLogger(StripeService.class);

    @Value("${stripe.secret.key}")
    private String stripeSecretKey;

    @Value("${stripe.webhook.secret}")
    private String stripeWebhookSecret;

    public void handleWebhookEvent(String payload, String sigHeader) throws Exception {
        Event event;

        // check the webhook
        try {
            event = Webhook.constructEvent(payload, sigHeader, stripeWebhookSecret);
        } catch (SignatureVerificationException e) {
            throw new RuntimeException("Webhook signature verification failed.", e);
        }

        switch (event.getType()) {
            case "account.updated":
                processAccountUpdated(event);
                break;

            // Handle other event types like 'payment_intent.succeeded' for order fulfillment
            // case "payment_intent.succeeded":
            //     // ... logic to fulfill order ...
            //     break;

            default:
                System.out.println("Received unhandled event type: " + event.getType());
                break;
        }
    }

    private void processAccountUpdated(Event event) {
        Account account = (Account) event.getDataObjectDeserializer().getObject()
                .orElseThrow(() -> new RuntimeException("Could not deserialize Account object from webhook."));

        // seller stripe id
        String stripeAccountId = account.getId();

        // seller id in my database
        String internalSellerIdStr = account.getMetadata().get("internal_seller_id");

        if (internalSellerIdStr == null) {
            throw new RuntimeException("Webhook 'account.updated' received but missing 'internal_seller_id' in metadata.");
        }

        Long internalSellerId = Long.parseLong(internalSellerIdStr);

        // 3. **PERSISTENCE**: Save the ID to your database
        saveStripeAccountId(internalSellerId, stripeAccountId);
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
}
