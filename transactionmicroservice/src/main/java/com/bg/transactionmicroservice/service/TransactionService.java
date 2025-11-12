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
import java.util.UUID;

@Service
public class TransactionService {

    private static final Logger log = LoggerFactory.getLogger(TransactionService.class);

    private final TransactionRepository transactionRepository;

    private final ListingClient listingClient;

    public TransactionService(TransactionRepository transactionRepository, ListingClient listingClient) {
        this.transactionRepository = transactionRepository;
        this.listingClient = listingClient;
    }

    public Transaction purchase(Transaction transaction) {
        if (!checkPurchaseTransactionContent(transaction)) {
            log.error("Invalid purchase transaction content");
            throw new IllegalArgumentException("Invalid purchase transaction content");
        }
        transaction.setTransactionId(UUID.randomUUID().toString());
        transaction.setDate(new Date());
        transaction.setStatus("completed");
        // TODO: set commission and set stripe commission

        // get post from listing service
        GetPostRequest getPostRequest = GetPostRequest.newBuilder()
                .setPostId(transaction.getPostId())
                .build();
        GetPostResponse getPostResponse = listingClient.getPost(getPostRequest);

        // postDTO
        PostDTO post = new PostDTO();
        post.setPostId(transaction.getPostId());
        post.setClientId(getPostResponse.getClientId()); // because transaction.clientId is the buyer, listing.clientId is the seller

        // from postDTO.clientId get client from user service


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

    // stripe balance per clientId
}
