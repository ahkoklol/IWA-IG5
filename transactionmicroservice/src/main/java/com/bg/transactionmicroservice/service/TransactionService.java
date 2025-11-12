package com.bg.transactionmicroservice.service;

import com.bg.transactionmicroservice.client.ListingClient;
import com.bg.transactionmicroservice.client.UserClient;
import com.bg.transactionmicroservice.entity.PostDTO;
import com.bg.transactionmicroservice.entity.Transaction;
import com.bg.transactionmicroservice.repository.TransactionRepository;
import com.bg.usermicroservice.grpc.GetStripeIdRequest;
import com.bg.usermicroservice.grpc.GetStripeIdResponse;
import com.bondgraine.listingmicroservice.grpc.GetPostRequest;
import com.bondgraine.listingmicroservice.grpc.GetPostResponse;
import com.stripe.model.PaymentIntent;
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

    private final UserClient userClient;

    public TransactionService(TransactionRepository transactionRepository, ListingClient listingClient, StripeService stripeService, UserClient userClient) {
        this.transactionRepository = transactionRepository;
        this.listingClient = listingClient;
        this.stripeService = stripeService;
        this.userClient = userClient;
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
        transaction.setCommission(getPostResponse.getPrice() * platformCommission);
        transaction.setStripeCommission(getPostResponse.getPrice() * stripePercentageCommission + stripeFlatCommission);
        double total = getPostResponse.getPrice() + transaction.getStripeCommission() + transaction.getCommission();
        transaction.setTotal(total);

        // make the stripe payment
        GetStripeIdRequest request = GetStripeIdRequest.newBuilder()
                .setClientId(transaction.getClientId())
                .build();
        GetStripeIdResponse response = userClient.getStripeId(request);

        try {
            long amountInCents = (long) (transaction.getTotal() * 100);
            long applicationFeeAmountInCents = (long) (transaction.getCommission() * 100);

            PaymentIntent paymentIntent = stripeService.createDestinationPaymentIntent(
                    amountInCents,
                    response.getStripeId(),
                    transaction.getPaymentMethodId(),
                    applicationFeeAmountInCents,
                    transaction.getTransactionId()
            );
            // Save Stripe tracking IDs and update status based on Intent result
            transaction.setStripePaymentIntentId(paymentIntent.getId());
            // Check if the Intent requires further action (like 3D Secure)
            if ("requires_action".equals(paymentIntent.getStatus())) {
                transaction.setStatus("requires_action");
            }
        } catch (Exception e) {
            log.error("Failed to create Stripe Payment Intent for transaction {}.", transaction.getTransactionId(), e);
            transaction.setStatus("failed");
        }
        return transactionRepository.save(transaction);
    }

    boolean checkPurchaseTransactionContent(Transaction transaction) {
        if (transaction.getPostId() == null || transaction.getPostId().isEmpty()) return false;
        if (transaction.getClientId() == null || transaction.getClientId().isEmpty()) return false;
        if (transaction.getPaymentMethodId() == null || transaction.getPaymentMethodId().isEmpty()) return false;
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
     * Updates the stripe data in a Transaction
     * @param transaction a Trnasaction object
     */
    public void updateStripeData(Transaction transaction) {
        Optional<Transaction> optionalTransaction = getTransaction(transaction.getTransactionId());
        if (optionalTransaction.isEmpty()) {
            log.error("Transaction with id {} not found", transaction.getTransactionId());
            throw new IllegalArgumentException("Transaction with id " + transaction.getTransactionId() + " not found");
        }
        optionalTransaction.get().setPaymentMethodId(transaction.getPaymentMethodId());
        optionalTransaction.get().setStripePaymentIntentId(transaction.getStripePaymentIntentId());
        transactionRepository.save(optionalTransaction.get());
    }

    /**
     * Updates a Transaction to completed
     * @param transactionId the id of the Transaction
     * @param completed the status of the transaction
     */
    public void updateTransactionToCompleted(String transactionId, boolean completed) {
        Optional<Transaction> optionalTransaction = getTransaction(transactionId);
        if (optionalTransaction.isEmpty()) {
            log.error("Transaction with id {} not found", transactionId);
            throw new IllegalArgumentException("Transaction with id " + transactionId + " not found");
        }
        if (optionalTransaction.get().getStatus().equals("completed")) {
            log.warn("Transaction with id {} already completed", transactionId);
            throw new IllegalArgumentException("Transaction with id " + transactionId + " already completed");
        }
        Transaction transaction = optionalTransaction.get();

        // from postDTO.clientId get client from user service
        //stripeService.createDestinationPaymentIntent();

        transaction.setStatus("completed");
        transactionRepository.save(transaction);
    }

    // stripe balance per clientId
}
