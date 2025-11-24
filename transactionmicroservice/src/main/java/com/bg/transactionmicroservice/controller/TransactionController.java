package com.bg.transactionmicroservice.controller;

import com.bg.transactionmicroservice.entity.Transaction;
import com.bg.transactionmicroservice.service.StripeService;
import com.bg.transactionmicroservice.service.TransactionService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@ConditionalOnProperty(name = "stripe.enabled", havingValue = "true")
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

}