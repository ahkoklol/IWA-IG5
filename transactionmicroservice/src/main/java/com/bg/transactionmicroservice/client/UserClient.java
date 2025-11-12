package com.bg.transactionmicroservice.client;

import com.bg.usermicroservice.grpc.*;
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

    public GetStripeIdResponse getStripeId(GetStripeIdRequest getStripeIdRequest) {
        return userClientStub.getStripeId(getStripeIdRequest);
    }
}
