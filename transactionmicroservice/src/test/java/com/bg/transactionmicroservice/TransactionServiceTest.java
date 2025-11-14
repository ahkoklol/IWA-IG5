package com.bg.transactionmicroservice;

import com.bg.transactionmicroservice.entity.Transaction;
import com.bg.transactionmicroservice.repository.TransactionRepository;
import com.bg.transactionmicroservice.service.TransactionService;
import jakarta.transaction.Transactional;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;

import java.util.Date;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertThrows;

@Transactional
public class TransactionServiceTest extends PostgresTestcontainer { // Assuming PostgresTestcontainer is correctly set up

    @Autowired
    private TransactionService transactionService;

    @Autowired
    private TransactionRepository transactionRepository;

    private final String defaultBuyerId = "BUYER-123";
    private final String otherBuyerId = "BUYER-456";
    private Transaction completedTransaction;

    /**
     * Helper method to create a base Transaction object.
     * @param transactionId The ID for the transaction.
     * @param clientId The ID of the buyer.
     * @return A new Transaction object.
     */
    private Transaction createBaseTransaction(String transactionId, String clientId) {
        Transaction transaction = new Transaction();
        transaction.setTransactionId(transactionId);
        transaction.setDate(new Date());
        transaction.setStatus("pending");
        transaction.setCommission(1.50);
        transaction.setStripeCommission(0.50);
        transaction.setClientId(clientId);
        transaction.setPostId("POST-" + transactionId.substring(4));
        return transaction;
    }

    @BeforeEach
    void setUp() {
        transactionRepository.deleteAll(); // Ensure a clean slate before each test

        Transaction transaction = createBaseTransaction("TRX-COMP-001", defaultBuyerId);
        this.completedTransaction = transactionRepository.save(transaction);

        Transaction otherTransaction = createBaseTransaction("TRX-COMP-003", otherBuyerId);
        transactionRepository.save(otherTransaction);
    }

    @Test
    void testPurchase_Successful() {
        Transaction newTransactionData = createBaseTransaction("newTransaction", defaultBuyerId);

        Transaction createdTransaction = transactionService.purchase(newTransactionData);

        assertThat(createdTransaction).isNotNull();
        assertThat(createdTransaction.getTransactionId()).isNotNull();
        assertThat(createdTransaction.getDate()).isNotNull();
        assertThat(createdTransaction.getStatus().equals("completed")).isTrue();

        Transaction fetchedTransaction = transactionRepository.findById(createdTransaction.getTransactionId()).orElse(null);

        assertThat(fetchedTransaction).isNotNull();
        assertThat(fetchedTransaction.getClientId()).isEqualTo("BUYER-123");
        assertThat(fetchedTransaction.getCommission()).isEqualTo(1.5);
    }

    @Test
    void testPurchase_MissingFields_ThrowsIllegalArgumentException() {
        Transaction transaction = new Transaction();
        transaction.setClientId(defaultBuyerId);
        assertThrows(
                IllegalArgumentException.class,
                () -> transactionService.purchase(transaction)
        );
    }

    @Test
    void testGetTransactions_ForDefaultClient_ReturnsCorrectCount() {
        List<Transaction> transactions = transactionService.getTransactions(defaultBuyerId);

        assertThat(transactions).hasSize(1);
    }

    @Test
    void testGetTransactions_ForDefaultClient_ContainsCorrectTransactions() {
        List<Transaction> transactions = transactionService.getTransactions(defaultBuyerId);

        // Ensure the list contains only the transactions linked to the default buyer
        assertThat(transactions)
                .extracting(Transaction::getClientId)
                .containsOnly(defaultBuyerId);

        // Ensure the list contains the specific transaction IDs set up
        assertThat(transactions)
                .extracting(Transaction::getTransactionId)
                .containsExactlyInAnyOrder(completedTransaction.getTransactionId());
    }

    @Test
    void testGetTransactions_ForOtherClient_ReturnsCorrectCount() {
        List<Transaction> transactions = transactionService.getTransactions(otherBuyerId);

        // Should find exactly 1 transaction for otherBuyerId
        assertThat(transactions).hasSize(1);
        assertThat(transactions.getFirst().getClientId()).isEqualTo(otherBuyerId);
    }

    @Test
    void testGetTransactions_ForNonExistentClient_ReturnsEmptyList() {
        String nonExistentClientId = "fakeid";

        List<Transaction> transactions = transactionService.getTransactions(nonExistentClientId);

        assertThat(transactions).isEmpty();
    }
}