package com.bg.transactionmicroservice.config;

import com.bondgraine.listingmicroservice.grpc.ListingServiceGrpc;
import com.bondgraine.listingmicroservice.grpc.ListingServiceGrpc.ListingServiceBlockingStub;
import com.bg.usermicroservice.grpc.UserServiceGrpc;
import com.bg.usermicroservice.grpc.UserServiceGrpc.UserServiceBlockingStub;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.grpc.client.GrpcChannelFactory;

@Configuration
public class GrpcClientConfiguration {

    @Bean
    public ListingServiceBlockingStub listingStub(GrpcChannelFactory channels) {
        return ListingServiceGrpc.newBlockingStub(channels.createChannel("listing"));
    }

    @Bean
    public UserServiceBlockingStub userStub(GrpcChannelFactory channels) {
        return UserServiceGrpc.newBlockingStub(channels.createChannel("user"));
    }
}
