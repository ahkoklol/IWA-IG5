package com.ai.aimicroservice.service;

import com.ai.aimicroservice.client.MediaServiceClient;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import software.amazon.awssdk.core.SdkBytes;
import software.amazon.awssdk.services.rekognition.RekognitionClient;
import software.amazon.awssdk.services.rekognition.model.*;

import java.util.ArrayList;
import java.util.List;
import java.util.Set;

@Service
public class ImageAnalysisService {

    private static final Logger log = LoggerFactory.getLogger(ImageAnalysisService.class);

    private final MediaServiceClient mediaServiceClient;
    private final RekognitionClient rekognitionClient;

    public ImageAnalysisService(MediaServiceClient mediaServiceClient, RekognitionClient rekognitionClient) {
        this.mediaServiceClient = mediaServiceClient;
        this.rekognitionClient = rekognitionClient;
    }

    /**
     * Analyze an image to check if the context is respected
     * Also check for inappropriate content
     * @param image the image to analyze
     * @return the response from the LLM
     */
    String analyzeImage(String image) {
        try {
            byte[] bytes = mediaServiceClient.getS3ObjectBytes(image).get(); // blocks until result
            List<String> labels = detectLabels(bytes);
            boolean result = filterLabels(labels);
            return "Labels: " + labels + " | Allowed: " + result;
        } catch (Exception e) {
            throw new RuntimeException("Failed to analyze image", e);
        }
    }

    /**
     * Detect labels of an image (from bytes) using AWS Rekognition
     * @param imageBytes
     * @return a List<String> of identified labels
     */
    public List<String> detectLabels(byte[] imageBytes) {
        List<String> labelsList = new ArrayList<>();

        try {
            SdkBytes bytes = SdkBytes.fromByteArray(imageBytes);

            Image image = Image.builder()
                    .bytes(bytes)
                    .build();

            DetectLabelsRequest request = DetectLabelsRequest.builder()
                    .image(image)
                    .maxLabels(10)
                    .minConfidence(75F)
                    .build();

            DetectLabelsResponse result = rekognitionClient.detectLabels(request);
            for (Label label : result.labels()) {
                labelsList.add(label.name() + " : " + label.confidence());
            }

        } catch (RekognitionException e) {
            log.error("Rekognition error", e);
        }

        log.info("Detected labels: {}", labelsList);

        return labelsList;
    }

    /**
     * Filters the labels from Rekognition to check if the picture is allowed
     * @param labelsList the list of labels returned by Rekognition
     * @return true if allowed, else false
     */
    public boolean filterLabels(List<String> labelsList) {

        List<String> adjustedLabelsList = new ArrayList<>();

        for (String label : labelsList) {
            String cleanLabel = label.split(":")[0].trim(); // take only "Seed"
            adjustedLabelsList.add(cleanLabel);
        }

        log.info("Detected labels: " + adjustedLabelsList);

        Set<String> allowedSeedLabels = Set.of(
                "Seed", "Grain", "Plant", "Produce", "Vegetable",
                "Fruit", "Nut", "Bean", "Sprout", "Flower", "Crop"
        );

        Set<String> bannedLabels = Set.of("Marijuana", "Cannabis", "Weed", "Hemp");

        // First check if it contains any banned label
        boolean hasBanned = adjustedLabelsList.stream()
                .anyMatch(bannedLabels::contains);

        if (hasBanned) {
            log.info("Image contains a banned label");
            return false;
        }

        // Then check if it has at least one allowed label

        return adjustedLabelsList.stream()
                .anyMatch(allowedSeedLabels::contains);
    }

    /**
     * Extracts the labels part from the LLM image analysis response.
     * Example input: "Labels: [Seed, Plant] | Allowed: true"
     * Output: "[Seed, Plant]"
     */
    String extractLabels(String analysisResponse) {
        if (analysisResponse == null) return "";

        int start = analysisResponse.indexOf("Labels:");
        int end = analysisResponse.indexOf("| Allowed");

        if (start == -1 || end == -1 || start >= end) return "";

        return analysisResponse.substring(start + "Labels:".length(), end).trim();
    }

    /**
     * Extracts the verdict (Allowed true/false) from the LLM image analysis response.
     * Example input: "Labels: [Seed, Plant] | Allowed: true"
     * Output: true
     */
    boolean extractVerdictImage(String analysisResponse) {
        if (analysisResponse == null) return false;

        int idx = analysisResponse.indexOf("| Allowed:");
        if (idx == -1) return false;

        String verdictStr = analysisResponse.substring(idx + "| Allowed:".length()).trim();
        return "true".equalsIgnoreCase(verdictStr);
    }
}
