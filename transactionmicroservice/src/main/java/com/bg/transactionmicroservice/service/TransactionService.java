package com.bg.transactionmicroservice.service;

import com.bg.transactionmicroservice.client.ListingClient;
import com.bg.transactionmicroservice.entity.PostDTO;
import com.bg.transactionmicroservice.entity.Transaction;
import com.bg.transactionmicroservice.repository.TransactionRepository;
import com.bondgraine.listingmicroservice.grpc.GetPostRequest;
import com.bondgraine.listingmicroservice.grpc.GetPostResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class TransactionService {

    private static final Logger log = LoggerFactory.getLogger(TransactionService.class);

    private final TransactionRepository transactionRepository;

    private final ListingClient listingClient;

    private final StripeService stripeService;

    public TransactionService(TransactionRepository transactionRepository, ListingClient listingClient, StripeService stripeService) {
        this.transactionRepository = transactionRepository;
        this.listingClient = listingClient;
        this.stripeService = stripeService;
    }

    public Transaction purchase(Transaction transaction) {
        double platformCommission = 0.05; // 5%
        double stripeFlatCommission = 0.25; // 0.25cents
        double stripePercentageCommission = 0.015; // 1.5%
        if (!checkPurchaseTransactionContent(transaction)) {
            log.error("Invalid purchase transaction content");
            throw new IllegalArgumentException("Invalid purchase transaction content");
        }
        transaction.setTransactionId(UUID.randomUUID().toString());
        transaction.setDate(new Date());
        transaction.setStatus("initiated");

        // get post from listing service
        GetPostRequest getPostRequest = GetPostRequest.newBuilder()
                .setPostId(transaction.getPostId())
                .build();
        GetPostResponse getPostResponse = listingClient.getPost(getPostRequest);

        // postDTO
        PostDTO post = new PostDTO();
        post.setPostId(transaction.getPostId());
        post.setClientId(getPostResponse.getClientId()); // because transaction.clientId is the buyer, listing.clientId is the seller
        post.setPrice(getPostResponse.getPrice());

        // set commissions
        transaction.setCommission(post.getPrice() * platformCommission);
        transaction.setStripeCommission(post.getPrice() * stripePercentageCommission + stripeFlatCommission);
        double total = post.getPrice() + transaction.getStripeCommission() + transaction.getCommission();
        transaction.setTotal(total);

        // get stripeId, paymentMethodId from webhook

        // make the stripe payment
        long amountInCents = (long) (total * 100);
        //stripeService.createDestinationPaymentIntent();


        // from postDTO.clientId get client from user service
        //stripeService.createDestinationPaymentIntent();

        // from clientDTO.stripeId save transactions
        return transactionRepository.save(transaction);
    }

    boolean checkPurchaseTransactionContent(Transaction transaction) {
        if (transaction.getPostId() == null || transaction.getPostId().isEmpty()) return false;
        if (transaction.getClientId() == null || transaction.getClientId().isEmpty()) return false;
        return true;
    }

    public List<Transaction> getTransactions(String clientId) {
        List<Transaction> list = transactionRepository.findByClientId(clientId);
        log.info("Found {} transactions for client {}", list.size(), clientId);
        return list;
    }

    private Optional<Transaction> getTransaction(String transactionId) {
        return transactionRepository.findById(transactionId);
    }

    /**
     * Updates a Transaction status
     * @param transactionId the id of the Transaction
     * @param completed the status of the transaction
     */
    public void updateTransactionStatusToCompleted(String transactionId, boolean completed) {
        Optional<Transaction> optionalTransaction = getTransaction(transactionId);
        if (optionalTransaction.isEmpty()) {
            log.error("Transaction with id {} not found", transactionId);
            throw new IllegalArgumentException("Transaction with id " + transactionId + " not found");
        }
        if (optionalTransaction.get().getStatus().equals("completed")) {
            log.warn("Transaction with id {} already completed", transactionId);
            throw new IllegalArgumentException("Transaction with id " + transactionId + " already completed");
        }
        optionalTransaction.get().setStatus("completed");
        transactionRepository.save(optionalTransaction.get());
    }

    // stripe balance per clientId
}
