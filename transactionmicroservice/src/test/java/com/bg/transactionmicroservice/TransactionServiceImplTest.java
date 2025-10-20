package com.bg.transactionmicroservice;

import com.bg.transactionmicroservice.entity.Transaction;
import com.bg.transactionmicroservice.grpc.PurchaseRequest;
import com.bg.transactionmicroservice.grpc.PurchaseResponse;
import com.bg.transactionmicroservice.service.TransactionService;
import com.bg.transactionmicroservice.service.TransactionServiceImpl;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Date;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class TransactionServiceImplTest {

    @Mock
    private TransactionService transactionService;

    @InjectMocks
    private TransactionServiceImpl transactionServiceImpl;

    private static final String CLIENT_ID = "testclientid";
    private static final String POST_ID = "testpostid";

    private PurchaseRequest purchaseRequest;
    private Transaction successfulTransaction;

    @BeforeEach
    void setUp() {
        // Build a sample request object
        purchaseRequest = PurchaseRequest.newBuilder()
                .setClientId(CLIENT_ID)
                .setPostId(POST_ID)
                .build();

        successfulTransaction = new Transaction();
        successfulTransaction.setTransaction_id("testtransactionid");
        successfulTransaction.setStatus("ok");
        successfulTransaction.setDate(new Date());
        successfulTransaction.setCommission(3);
        successfulTransaction.setStripe_commission(3);
        successfulTransaction.setPostId(POST_ID);
        successfulTransaction.setClientId(CLIENT_ID);
    }

    @Test
    void purchase_ShouldReturnSuccess_WhenServiceReturnsTransaction() {
        when(transactionService.purchase(any(Transaction.class))).thenReturn(successfulTransaction);
        PurchaseResponse response = transactionServiceImpl.purchase(purchaseRequest);
        assertTrue(response.getSuccess());
        verify(transactionService).purchase(any(Transaction.class));
    }

    @Test
    void purchase_ShouldReturnFailure_WhenServiceReturnsNull() {
        when(transactionService.purchase(any(Transaction.class))).thenReturn(null);
        PurchaseResponse response = transactionServiceImpl.purchase(purchaseRequest);
        assertFalse(response.getSuccess());
        assertEquals("problem", response.getErrorMessage());
        verify(transactionService).purchase(any(Transaction.class));
    }
}