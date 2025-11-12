package com.bg.transactionmicroservice.client;

import com.bg.usermicroservice.grpc.UpdateStripeIdRequest;
import com.bg.usermicroservice.grpc.UpdateStripeIdResponse;
import com.bg.usermicroservice.grpc.UserServiceGrpc;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class UserClient {

    private UserServiceGrpc.UserServiceBlockingStub userClientStub;

    @Autowired
    public UserClient(UserServiceGrpc.UserServiceBlockingStub userClientStub) {
        this.userClientStub = userClientStub;
    }

    public UpdateStripeIdResponse updateStripeId(UpdateStripeIdRequest updateStripeIdRequest) {
        return userClientStub.updateStripeId(updateStripeIdRequest);
    }
}
