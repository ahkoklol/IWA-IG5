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
        transaction.setTransaction_id(UUID.randomUUID().toString());
        transaction.setDate(new Date());
        return transactionRepository.save(transaction);
    }

    public List<Transaction> getTransactions(String clientId) {
        List<Transaction> list = transactionRepository.findByClientId(clientId);
        log.info("Found {} transactions for client {}", list.size(), clientId);
        return list;
    }
}
