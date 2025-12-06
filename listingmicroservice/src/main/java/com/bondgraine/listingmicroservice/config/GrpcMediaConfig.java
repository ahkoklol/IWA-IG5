package com.bondgraine.listingmicroservice.config;

import com.micro.media.grpc.MediaServiceGrpc;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.grpc.client.GrpcChannelFactory;

@Configuration
public class GrpcMediaConfig {


    @Bean
    public MediaServiceGrpc.MediaServiceBlockingStub mediaBlockingStub(GrpcChannelFactory channels) {
        return MediaServiceGrpc.newBlockingStub(channels.createChannel("media"));
    }
}
