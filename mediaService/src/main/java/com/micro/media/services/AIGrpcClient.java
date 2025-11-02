package com.micro.media.services;

import io.grpc.ManagedChannel;
import io.grpc.ManagedChannelBuilder;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.io.File;
import java.util.concurrent.TimeUnit;

/*
 * Client gRPC minimal : ouvre un channel, montre où placer l'appel réel au stub,
 * et retourne un résultat simulé pour l'instant.
 * Remplacer les parties commentées par vos classes générées à partir du .proto.
 */
@Component
public class AIGrpcClient {

    private final String host;
    private final int port;

    public AIGrpcClient(
            @Value("${ai.grpc.host:localhost}") String host,
            @Value("${ai.grpc.port:50051}") int port) {
        this.host = host;
        this.port = port;
    }

    public AIService.AIServiceResult analyze(File imageFile, String imageUrl) {
        ManagedChannel channel = ManagedChannelBuilder.forAddress(host, port)
                .usePlaintext() // enlever en prod si TLS activé
                .build();

        try {
            // TODO: remplacer la simulation par l'appel réel au stub généré par protoc
            // Exemple (commenté) :
            // AiServiceGrpc.AiServiceBlockingStub stub = AiServiceGrpc.newBlockingStub(channel);
            // AnalyzeRequest req = AnalyzeRequest.newBuilder()
            //        .setImageUrl(imageUrl)
            //        // ajouter les champs nécessaires
            //        .build();
            // AnalyzeResponse resp = stub.analyze(req);
            // return new AIService.AIServiceResult(resp.getIsValid(), resp.getConfidence(), resp.getDescription());

            // Simulation temporaire
            boolean aiSaysValid = Math.random() > 0.3;
            double confidence = Math.random();
            String aiDescription = "gRPC simulé";

            return new AIService.AIServiceResult(aiSaysValid, confidence, aiDescription);
        } finally {
            try {
                channel.shutdown().awaitTermination(1, TimeUnit.SECONDS);
            } catch (InterruptedException ignored) {
                Thread.currentThread().interrupt();
            }
        }
    }
}
