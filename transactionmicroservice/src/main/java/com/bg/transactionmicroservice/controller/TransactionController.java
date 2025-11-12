package com.bg.transactionmicroservice.controller;

import com.bg.transactionmicroservice.entity.Transaction;
import com.bg.transactionmicroservice.service.StripeService;
import com.bg.transactionmicroservice.service.TransactionService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/transaction")
public class TransactionController {

    private static final Logger log = LoggerFactory.getLogger(TransactionController.class);

    private final TransactionService transactionService;

    private final StripeService stripeService;

    public TransactionController(TransactionService transactionService, StripeService stripeService) {
        this.transactionService = transactionService;
        this.stripeService = stripeService;
    }

    @PostMapping("/purchase")
    public ResponseEntity<Transaction> purchase(@RequestBody Transaction transaction) {
        log.info("Received request to create post: {}", transaction);
        Transaction createdPost = transactionService.purchase(transaction);
        return new ResponseEntity<>(createdPost, HttpStatus.CREATED);
    }

    @GetMapping("/{clientId}")
    public ResponseEntity<List<Transaction>> findByClientId(@PathVariable String clientId) {
        log.info("Received request to get all transactions for client {}", clientId);
        List<Transaction> transactionList = transactionService.getTransactions(clientId);
        return ResponseEntity.ok(transactionList);
    }

    @PostMapping("/stripe")
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
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

}