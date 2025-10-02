package com.ai.aimicroservice.utils;

import org.testcontainers.containers.localstack.LocalStackContainer;
import org.testcontainers.junit.jupiter.Container;
import org.testcontainers.junit.jupiter.Testcontainers;
import org.testcontainers.utility.DockerImageName;
import software.amazon.awssdk.auth.credentials.AwsBasicCredentials;
import software.amazon.awssdk.auth.credentials.StaticCredentialsProvider;
import software.amazon.awssdk.core.async.AsyncRequestBody;
import software.amazon.awssdk.core.async.AsyncResponseTransformer;
import software.amazon.awssdk.regions.Region;
import software.amazon.awssdk.services.rekognition.RekognitionClient;
import software.amazon.awssdk.services.s3.S3AsyncClient;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.GetObjectRequest;
import software.amazon.awssdk.services.s3.model.PutObjectRequest;

import java.nio.file.Path;
import java.util.concurrent.CompletableFuture;

import static org.testcontainers.containers.localstack.LocalStackContainer.Service.S3;

@Testcontainers
public class Localstack {

    @Container
    public static LocalStackContainer localstack =
            new LocalStackContainer(DockerImageName.parse("localstack/localstack:latest"))
                    .withServices(S3);

    static {
        localstack.start(); // make sure the container is started before clients are created
    }

    public static S3Client createS3Client() {
        return S3Client.builder()
                .endpointOverride(localstack.getEndpointOverride(S3))
                .credentialsProvider(
                        StaticCredentialsProvider.create(
                                AwsBasicCredentials.create(
                                        localstack.getAccessKey(),
                                        localstack.getSecretKey()
                                )
                        )
                )
                .region(Region.of(localstack.getRegion()))
                .build();
    }

    public static S3AsyncClient createS3AsyncClient() {
        return S3AsyncClient.builder()
                .endpointOverride(localstack.getEndpointOverride(S3))
                .credentialsProvider(
                        StaticCredentialsProvider.create(
                                AwsBasicCredentials.create(
                                        localstack.getAccessKey(),
                                        localstack.getSecretKey()
                                )
                        )
                )
                .region(Region.of(localstack.getRegion()))
                .build();
    }

    /**
     * Download an object from LocalStack S3 asynchronously to a local path
     */
    public static CompletableFuture<byte[]> getObjectAsync(String bucketName, String key) {
        S3AsyncClient asyncClient = createS3AsyncClient();

        GetObjectRequest request = GetObjectRequest.builder()
                .bucket(bucketName)
                .key(key)
                .build();

        return asyncClient.getObject(request, AsyncResponseTransformer.toBytes())
                .thenApply(response -> {
                    asyncClient.close(); // close client after download
                    return response.asByteArray();
                });
    }

    /**
     * Upload a file to LocalStack S3 asynchronously
     */
    public static CompletableFuture<Void> uploadFileAsync(String bucketName, String key, Path filePath) {
        S3AsyncClient asyncClient = createS3AsyncClient();

        PutObjectRequest request = PutObjectRequest.builder()
                .bucket(bucketName)
                .key(key)
                .build();

        return asyncClient.putObject(request, AsyncRequestBody.fromFile(filePath))
                .thenRun(asyncClient::close); // close client after upload
    }


}