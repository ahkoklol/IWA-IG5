package com.bg.transactionmicroservice.service;

import com.bg.transactionmicroservice.entity.Transaction;
import com.bg.transactionmicroservice.grpc.PurchaseRequest;
import com.bg.transactionmicroservice.grpc.PurchaseResponse;
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

    public PurchaseResponse purchase(PurchaseRequest purchaseRequest) {
        Transaction transaction = new Transaction();
        transaction.setStatus("ok");
        transaction.setCommission(2);
        transaction.setStripe_commission(3);
        transaction.setClientId(purchaseRequest.getClientId());
        transaction.setPostId(purchaseRequest.getPostId());

        Transaction purchaseResult = transactionService.purchase(transaction);

        if (purchaseResult == null) {
            return PurchaseResponse.newBuilder()
                    .setSuccess(false)
                    .setErrorMessage("problem")
                    .build();
        }

        return PurchaseResponse.newBuilder()
                .setSuccess(true)
                .build();
    }

}