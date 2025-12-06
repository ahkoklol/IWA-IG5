package com.bg.usermicroservice.config;

import com.micro.media.grpc.MediaServiceGrpc;
import io.grpc.ManagedChannel;
import io.grpc.ManagedChannelBuilder;
import org.springframework.beans.factory.annotation.Value;
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
