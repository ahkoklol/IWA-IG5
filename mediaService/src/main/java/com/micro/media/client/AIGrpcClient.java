package com.micro.media.client;

import io.grpc.ManagedChannel;
import io.grpc.ManagedChannelBuilder;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import com.micro.media.entity.AiResultDTO;

import javax.annotation.PreDestroy;
import java.io.File;
import java.util.concurrent.TimeUnit;

@Component
public class AIGrpcClient {

    private final ManagedChannel channel;
    // private final AiServiceGrpc.AiServiceBlockingStub stub;

    public AIGrpcClient(
            @Value("${ai.grpc.host:localhost}") String host,
            @Value("${ai.grpc.port:50051}") int port) {
        this.channel = ManagedChannelBuilder.forAddress(host, port)
                .usePlaintext()
                .build();
        // this.stub = AiServiceGrpc.newBlockingStub(channel);
    }

    public AiResultDTO analyze(File imageFile, String imageUrl) {
        // TODO: remplacer par l'appel réel
        // AnalyzeRequest req = AnalyzeRequest.newBuilder().setImageUrl(imageUrl).build();
        // AnalyzeResponse resp = stub.analyze(req);
        // return new AiResultDTO(resp.getIsValid(), resp.getConfidence(), resp.getDescription());

        // Simulation temporaire
        boolean aiSaysValid = Math.random() > 0.3;
        double confidence = Math.random();
        return new AiResultDTO(aiSaysValid, confidence, "gRPC simulé");
    }

    @PreDestroy
    public void shutdown() {
        try {
            channel.shutdown().awaitTermination(5, TimeUnit.SECONDS);
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
            channel.shutdownNow();
        }
    }
}
