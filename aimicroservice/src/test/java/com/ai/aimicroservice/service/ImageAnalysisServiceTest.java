package com.ai.aimicroservice.service;

import com.ai.aimicroservice.TestAimicroserviceApplication;
import com.ai.aimicroservice.utils.Localstack;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.autoconfigure.EnableAutoConfiguration;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.context.TestConfiguration;
import org.springframework.context.annotation.Bean;
import software.amazon.awssdk.auth.credentials.AwsBasicCredentials;
import software.amazon.awssdk.auth.credentials.StaticCredentialsProvider;
import software.amazon.awssdk.regions.Region;
import software.amazon.awssdk.services.rekognition.RekognitionClient;

import java.nio.file.Path;
import java.util.List;
import java.util.concurrent.CompletableFuture;

import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;

@SpringBootTest(
        properties = "spring.main.allow-bean-definition-overriding=true",
        classes = {
                TestAimicroserviceApplication.class,  // Load your app
                ImageAnalysisServiceTest.TestConfig.class  // Add test beans
        }
)
@EnableAutoConfiguration(exclude = {
        org.springframework.boot.autoconfigure.jdbc.DataSourceAutoConfiguration.class,
        org.springframework.boot.autoconfigure.orm.jpa.HibernateJpaAutoConfiguration.class
})
public class ImageAnalysisServiceTest {

    @TestConfiguration
    static class TestConfig {
        @Bean
        public RekognitionClient rekognitionClient() {
            String accessKey = System.getenv("AWS_ACCESS_KEY_ID");
            String secretKey = System.getenv("AWS_SECRET_ACCESS_KEY");
            return RekognitionClient.builder()
                    .credentialsProvider(StaticCredentialsProvider.create(
                            AwsBasicCredentials.create(accessKey, secretKey)
                    ))
                    .region(Region.US_WEST_1)
                    .build();
        }
    }

    private static final String BUCKET = "test-bucket";

    @Autowired
    private ImageAnalysisService imageAnalysisService;

    @BeforeAll
    static void setup() throws Exception {
        // Start LocalStack and create bucket
        var s3Client = Localstack.createS3Client();
        s3Client.createBucket(b -> b.bucket(BUCKET));

        // Upload test images to LocalStack S3
        Localstack.uploadFileAsync(BUCKET, "tomatoplant.jpg",
                Path.of("src/test/resources/tomatoplant.jpg")).join();
        Localstack.uploadFileAsync(BUCKET, "weed.png",
                Path.of("src/test/resources/weed.png")).join();
        Localstack.uploadFileAsync(BUCKET, "weed2.jpg",
                Path.of("src/test/resources/weed2.jpg")).join();
    }

    @Test
    void analyzeTomatoPlantTest() throws Exception {
        // Download the object bytes from Localstack
        CompletableFuture<byte[]> future = Localstack.getObjectAsync(BUCKET, "tomatoplant.jpg");
        byte[] imageBytes = future.get(); // or future.join()

        // Call the service method with raw bytes
        List<String> labels = imageAnalysisService.detectLabels(imageBytes);

        assertFalse(labels.isEmpty(), "Labels should not be empty");

        boolean hasTomato = labels.stream()
                .anyMatch(l -> l.split(":")[0].trim().equalsIgnoreCase("Tomato"));
        assertTrue(hasTomato, "Labels should contain 'Tomato'");

        // filter the labels
        boolean filterResult = imageAnalysisService.filterLabels(labels);
        assertTrue(filterResult);
    }

    @Test
    void analyzeWeedTest() throws Exception {
        // Download the object bytes from Localstack
        CompletableFuture<byte[]> future = Localstack.getObjectAsync(BUCKET, "weed.png");
        byte[] imageBytes = future.get(); // or future.join()

        // Call the service method with raw bytes
        List<String> labels = imageAnalysisService.detectLabels(imageBytes);

        assertFalse(labels.isEmpty(), "Labels should not be empty");

        boolean hasWeed = labels.stream()
                .anyMatch(l -> l.split(":")[0].trim().equalsIgnoreCase("Weed"));
        assertTrue(hasWeed, "Labels should contain 'Weed'");

        // filter the labels
        boolean filterResult = imageAnalysisService.filterLabels(labels);
        assertFalse(filterResult);
    }

}
