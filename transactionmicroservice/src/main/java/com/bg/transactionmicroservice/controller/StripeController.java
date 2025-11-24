package com.bg.transactionmicroservice.controller;

import com.bg.transactionmicroservice.entity.ClientDTO;
import com.bg.transactionmicroservice.service.StripeService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@ConditionalOnProperty(name = "stripe.enabled", havingValue = "true")
@RestController
@RequestMapping("/stripe")
public class StripeController {

    private static final Logger log = LoggerFactory.getLogger(StripeController.class);

    private final StripeService stripeService;

    public StripeController(StripeService stripeService) {
        this.stripeService = stripeService;
    }

    @PostMapping("/register")
    public ResponseEntity<Map<String, String>> addStripeAccount (@RequestBody ClientDTO clientDTO) {
        Map<String, String> response = stripeService.createConnectedAccount(clientDTO);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/onboarding-link")
    public ResponseEntity<Map<String, String>> getOnboardingLink(@RequestBody ClientDTO clientDTO) {
        // Ensure the request includes the required ID
        if (clientDTO.getStripeId() == null || clientDTO.getStripeId().isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("error", "stripeAccountId is required."));
        }
        Map<String, String> response = stripeService.createAccountLink(clientDTO.getStripeId());
        return ResponseEntity.ok(response);
    }

    @PostMapping("/webhook")
    public ResponseEntity<Void> handleStripeWebhook(@RequestBody String payload, @RequestHeader("Stripe-Signature") String sigHeader) {
        try {
            // Delegate the raw payload and signature to the service layer
            stripeService.handleWebhookEvent(payload, sigHeader);
            // Stripe expects a 200 OK response to acknowledge receipt
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            // Log the error details
            System.err.println("Webhook processing failed: " + e.getMessage());
            // Return an HTTP 400 or 500 to signal failure to Stripe (Stripe will retry)
            return ResponseEntity.badRequest().build();
        }
    }
}
