package com.ai.aimicroservice.client;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.scheduler.Schedulers;

import java.util.concurrent.CompletableFuture;

@Component
public class MediaServiceClient {

    private static final Logger logger = LoggerFactory.getLogger(MediaServiceClient.class);

    private final WebClient webClient;

    public MediaServiceClient(WebClient.Builder webClientBuilder) {
        this.webClient = webClientBuilder.baseUrl("https://example.com").build();
    }

    /**
     * Fetch the object bytes from media service
     * @param objectId the name of the object to get
     * @return bytes of the object
     */
    public CompletableFuture<byte[]> getS3ObjectBytes(String objectId) {
        return webClient.get()
                .uri("/media/{objectId}", objectId)
                .retrieve()
                .bodyToMono(byte[].class)
                .publishOn(Schedulers.boundedElastic())
                .toFuture()
                .whenComplete((bytes, ex) -> {
                    if (ex != null) {
                        logger.error("Failed to fetch object {}", objectId, ex);
                    } else {
                        logger.info("Successfully fetched object {}", objectId);
                    }
                });
    }
}
