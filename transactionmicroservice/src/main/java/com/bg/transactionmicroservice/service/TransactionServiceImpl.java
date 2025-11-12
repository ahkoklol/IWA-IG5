package com.bg.transactionmicroservice.service;

import com.bg.transactionmicroservice.entity.Transaction;
import com.bg.transactionmicroservice.grpc.PurchaseRequest;
import com.bg.transactionmicroservice.grpc.PurchaseResponse;
import com.bg.transactionmicroservice.grpc.TransactionServiceGrpc;
import io.grpc.Status;
import io.grpc.StatusRuntimeException;
import io.grpc.stub.StreamObserver;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.grpc.server.service.GrpcService;

@GrpcService
public class TransactionServiceImpl {

    private static final Logger log = LoggerFactory.getLogger(TransactionServiceImpl.class);

    private final TransactionService transactionService;

    public TransactionServiceImpl(TransactionService transactionService) {
        this.transactionService = transactionService;
    }

    public void purchase(PurchaseRequest purchaseRequest, StreamObserver<PurchaseResponse> responseObserver) {
        Transaction transaction = new Transaction();
        transaction.setStatus("pending");
        // TODO: remove set commission and stripe commission
        transaction.setCommission(2);
        transaction.setStripeCommission(3);
        transaction.setClientId(purchaseRequest.getClientId());
        transaction.setPostId(purchaseRequest.getPostId());

        Transaction purchaseResult = transactionService.purchase(transaction);

        PurchaseResponse response;
        try {
            if (purchaseResult == null) {
                log.info("Problem while trying to purchase {}", purchaseRequest.getPostId());
                response = PurchaseResponse.newBuilder()
                        .setSuccess(false)
                        .setErrorMessage("problem")
                        .build();
            } else {
                log.info("Purchase successfull");
                response = PurchaseResponse.newBuilder()
                        .setSuccess(true)
                        .build();
            }
            responseObserver.onNext(response);
            responseObserver.onCompleted();
        } catch (Exception e) {
            log.error("Error processing purchase", e);
            responseObserver.onError(e);
        }
    }
}