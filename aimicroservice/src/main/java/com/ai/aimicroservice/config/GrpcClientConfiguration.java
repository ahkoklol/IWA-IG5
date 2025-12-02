package com.ai.aimicroservice.config;

import com.bg.reportingmicroservice.grpc.ReportingServiceGrpc;
import com.bg.reportingmicroservice.grpc.ReportingServiceGrpc.ReportingServiceBlockingStub;
import com.bondgraine.listingmicroservice.grpc.ListingServiceGrpc;
import com.bondgraine.listingmicroservice.grpc.ListingServiceGrpc.ListingServiceBlockingStub;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.grpc.client.GrpcChannelFactory;

@Configuration
public class GrpcClientConfiguration {

    @Bean
    public ListingServiceBlockingStub listingClientStub(GrpcChannelFactory channels) {
        return ListingServiceGrpc.newBlockingStub(channels.createChannel("listing"));
    }

    @Bean
    public ReportingServiceBlockingStub reportingClientStub(GrpcChannelFactory channels) {
        return ReportingServiceGrpc.newBlockingStub(channels.createChannel("reporting"));
    }

}
