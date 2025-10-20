package com.bondgraine.listingmicroservice.config;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.ApplicationListener;
import org.springframework.context.event.ContextRefreshedEvent;
import org.springframework.stereotype.Component;

@Component
public class GrpcServerStartupLogger implements ApplicationListener<ContextRefreshedEvent> {

    private static final Logger log = LoggerFactory.getLogger(GrpcServerStartupLogger.class);

    // Inject the gRPC server port from configuration
    // The default value for grpc.server.port is typically 9090 if not set.
    @Value("${grpc.server.port:0}")
    private int grpcPort;

    @Override
    public void onApplicationEvent(ContextRefreshedEvent event) {
        // This log executes after the Spring application context has successfully started.
        log.info("gRPC Server Started Successfully and is listening on port: {}", grpcPort);
    }
}