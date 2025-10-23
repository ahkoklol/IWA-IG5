package com.bg.transactionmicroservice.service;

import com.bg.transactionmicroservice.entity.Transaction;
import com.bg.transactionmicroservice.repository.TransactionRepository;
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

    public TransactionService(TransactionRepository transactionRepository) {
        this.transactionRepository = transactionRepository;
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
}
