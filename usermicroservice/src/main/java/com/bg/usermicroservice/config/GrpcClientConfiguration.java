package com.bg.usermicroservice.config;

import com.bondgraine.listingmicroservice.grpc.ListingServiceGrpc;
import com.bondgraine.listingmicroservice.grpc.ListingServiceGrpc.ListingServiceBlockingStub;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.grpc.client.GrpcChannelFactory;

@Configuration
public class GrpcClientConfiguration {

    @Bean
    public ListingServiceBlockingStub listingStub(GrpcChannelFactory channels) {

        return ListingServiceGrpc.newBlockingStub(channels.createChannel("listing"));
    }
}
