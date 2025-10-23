package com.bg.transactionmicroservice;

import com.bg.transactionmicroservice.entity.Transaction;
import com.bg.transactionmicroservice.grpc.PurchaseRequest;
import com.bg.transactionmicroservice.grpc.PurchaseResponse;
import com.bg.transactionmicroservice.service.TransactionService;
import com.bg.transactionmicroservice.service.TransactionServiceImpl;
import io.grpc.stub.StreamObserver;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Date;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class TransactionServiceImplTest {

    @Mock
    private TransactionService transactionService; // Mocks the core business logic

    @InjectMocks
    private TransactionServiceImpl transactionServiceImpl; // The gRPC implementation being tested

    @Mock
    private StreamObserver<PurchaseResponse> responseObserver; // Mocks the gRPC client connection

    private static final String CLIENT_ID = "testclientid";
    private static final String POST_ID = "testpostid";

    private PurchaseRequest purchaseRequest;
    private Transaction successfulTransaction;

    @BeforeEach
    void setUp() {
        // Build a sample gRPC request object
        purchaseRequest = PurchaseRequest.newBuilder()
                .setClientId(CLIENT_ID)
                .setPostId(POST_ID)
                .build();

        // Create the expected return object from the mocked service
        successfulTransaction = new Transaction();
        successfulTransaction.setTransactionId("testtransactionid");
        successfulTransaction.setStatus("completed"); // Use "completed" as per your service logic
        successfulTransaction.setDate(new Date());
        successfulTransaction.setCommission(3);
        successfulTransaction.setStripeCommission(3);
        successfulTransaction.setPostId(POST_ID);
        successfulTransaction.setClientId(CLIENT_ID);
    }

    // ----------------------------------------------------------------------
    // Test Case 1: Successful Purchase
    // ----------------------------------------------------------------------

    @Test
    void purchase_ShouldReturnSuccess_WhenServiceReturnsTransaction() {
        // ARRANGE: Mock the underlying business service to return a successful transaction
        when(transactionService.purchase(any(Transaction.class)))
                .thenReturn(successfulTransaction);

        // ACT: Call the ASYNCHRONOUS gRPC method with the StreamObserver
        transactionServiceImpl.purchase(purchaseRequest, responseObserver);

        // ASSERT: Capture the response sent to the client
        ArgumentCaptor<PurchaseResponse> responseCaptor = ArgumentCaptor.forClass(PurchaseResponse.class);

        // 1. Verify onNext was called with the response
        verify(responseObserver).onNext(responseCaptor.capture());

        // 2. Verify onCompleted was called (success signal)
        verify(responseObserver).onCompleted();

        // 3. Check the captured response content
        PurchaseResponse capturedResponse = responseCaptor.getValue();
        assertTrue(capturedResponse.getSuccess(), "The response success field should be true.");

        // 4. Verify the underlying service was called
        verify(transactionService).purchase(any(Transaction.class));
    }

    // ----------------------------------------------------------------------
    // Test Case 2: Purchase Fails (Service Returns Null)
    // ----------------------------------------------------------------------

    @Test
    void purchase_ShouldReturnFailure_WhenServiceReturnsNull() {
        // ARRANGE: Mock the underlying business service to return null (simulating an internal failure)
        when(transactionService.purchase(any(Transaction.class)))
                .thenReturn(null);

        // ACT: Call the ASYNCHRONOUS gRPC method with the StreamObserver
        transactionServiceImpl.purchase(purchaseRequest, responseObserver);

        // ASSERT: Capture the response sent to the client
        ArgumentCaptor<PurchaseResponse> responseCaptor = ArgumentCaptor.forClass(PurchaseResponse.class);

        // 1. Verify onNext was called with the failure response
        verify(responseObserver).onNext(responseCaptor.capture());

        // 2. Verify onCompleted was called
        verify(responseObserver).onCompleted();

        // 3. Check the captured response content
        PurchaseResponse capturedResponse = responseCaptor.getValue();
        assertFalse(capturedResponse.getSuccess(), "The response success field should be false.");
        assertEquals("problem", capturedResponse.getErrorMessage(), "The error message should match the one set in the service.");

        // 4. Verify the underlying service was called
        verify(transactionService).purchase(any(Transaction.class));
    }
}