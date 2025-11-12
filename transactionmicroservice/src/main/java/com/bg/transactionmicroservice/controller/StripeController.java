package com.bg.transactionmicroservice.controller;

import com.bg.transactionmicroservice.entity.ClientDTO;
import com.bg.transactionmicroservice.service.StripeService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

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
}
