package com.ai.aimicroservice.utils;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;
import software.amazon.awssdk.core.ResponseBytes;
import software.amazon.awssdk.core.async.AsyncResponseTransformer;
import software.amazon.awssdk.services.s3.S3AsyncClient;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.GetObjectRequest;
import software.amazon.awssdk.services.s3.model.GetObjectResponse;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.concurrent.CompletableFuture;

@Component
public class Utils {

    private static final Logger logger = LoggerFactory.getLogger(Utils.class);

    private final S3AsyncClient s3Client;

    private Utils(S3AsyncClient s3Client) {
        this.s3Client = s3Client;
    }

    /**
     * Asynchronously retrieves the bytes of an object from an Amazon S3 bucket and writes them to a local file.
     *
     * @param bucketName the name of the S3 bucket containing the object
     * @param keyName    the key (or name) of the S3 object to retrieve
     * @param path       the local file path where the object's bytes will be written
     * @return a {@link CompletableFuture} that completes when the object bytes have been written to the local file
     */
    public CompletableFuture<Void> getObjectBytesAsync(String bucketName, String keyName, String path) {
        GetObjectRequest objectRequest = GetObjectRequest.builder()
                .key(keyName)
                .bucket(bucketName)
                .build();

        return s3Client.getObject(objectRequest, AsyncResponseTransformer.toBytes())
                .thenAccept(objectBytes -> {
                    try {
                        byte[] data = objectBytes.asByteArray();
                        Path filePath = Paths.get(path);
                        Files.write(filePath, data);
                        logger.info("Successfully obtained bytes from an S3 object: {}", keyName);
                    } catch (IOException ex) {
                        throw new RuntimeException("Failed to write data to file", ex);
                    }
                })
                .whenComplete((resp, ex) -> {
                    if (ex != null) {
                        logger.error("Failed to get object bytes from S3: {}", keyName, ex);
                    }
                });
    }

}
