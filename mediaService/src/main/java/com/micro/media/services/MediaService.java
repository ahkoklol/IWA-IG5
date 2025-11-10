package com.micro.media.services;

import com.micro.media.repository.ImageRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.UUID;

@Service
public class MediaService {

    @Autowired
    private ImageRepository imageRepository;

    @Autowired
    private AIService aiValidationService;

    /**
     * Upload d'image de post via gRPC (avec validation IA)
     */
    public String uploadPostImage(byte[] imageBytes, String originalFilename, String contentType) throws IOException {
        validateImageBytes(imageBytes, contentType);
        File tempFile = createTemporaryFile(imageBytes, originalFilename);

        try {
            String uniqueFileName = generateUniqueFileName(originalFilename);
            String pendingUrl = imageRepository.uploadPostPicture(tempFile, uniqueFileName);
            AIService.AIServiceResult aiResult = sendImageToAI(tempFile, pendingUrl);
            boolean isImageApproved = processAIValidationResult(aiResult);
            return moveToFinalDestination(uniqueFileName, isImageApproved);
        } finally {
            cleanupTemporaryFile(tempFile);
        }
    }

    /**
     * Upload d'image de profil via gRPC (sans validation IA)
     */
    public String uploadProfileImage(byte[] imageBytes, String originalFilename, String contentType) throws IOException {
        validateImageBytes(imageBytes, contentType);
        File tempFile = createTemporaryFile(imageBytes, originalFilename);

        try {
            String uniqueFileName = generateUniqueFileName(originalFilename);
            return imageRepository.uploadProfilePicture(tempFile, uniqueFileName);
        } finally {
            cleanupTemporaryFile(tempFile);
        }
    }

    private void validateImageBytes(byte[] imageBytes, String contentType) {
        if (imageBytes == null || imageBytes.length == 0) {
            throw new IllegalArgumentException("Fichier vide");
        }

        if (contentType == null || !contentType.startsWith("image/")) {
            throw new IllegalArgumentException("Le fichier doit être une image");
        }

        String[] allowedTypes = {"image/png", "image/jpeg", "image/jpg", "image/webp"};
        boolean isAllowed = false;
        for (String allowed : allowedTypes) {
            if (allowed.equalsIgnoreCase(contentType)) {
                isAllowed = true;
                break;
            }
        }
        if (!isAllowed) {
            throw new IllegalArgumentException("Format d'image non supporté. Formats acceptés : PNG, JPEG, JPG, WEBP");
        }

        long maxSizeBytes = 10 * 1024 * 1024;
        if (imageBytes.length > maxSizeBytes) {
            throw new IllegalArgumentException("Fichier trop volumineux (max 10MB)");
        }
    }

    private File createTemporaryFile(byte[] imageBytes, String originalFilename) {
        try {
            Path tempDir = Paths.get(System.getProperty("java.io.tmpdir"));
            Path tempFile = Files.createTempFile(tempDir, "upload_", "_" + originalFilename);
            Files.write(tempFile, imageBytes);
            return tempFile.toFile();
        } catch (IOException e) {
            throw new RuntimeException("Erreur création fichier temporaire", e);
        }
    }

    private String generateUniqueFileName(String originalFilename) {
        String extension = extractFileExtension(originalFilename);
        return UUID.randomUUID().toString() + extension;
    }

    private String extractFileExtension(String filename) {
        if (filename != null && filename.contains(".")) {
            return filename.substring(filename.lastIndexOf("."));
        }
        return "";
    }

    private AIService.AIServiceResult sendImageToAI(File imageFile, String imageUrl) {
        return aiValidationService.sendToAIService(imageFile, imageUrl);
    }

    private boolean processAIValidationResult(AIService.AIServiceResult aiResult) {
        return aiValidationService.validateAIResult(aiResult);
    }

    private String moveToFinalDestination(String fileName, boolean isApproved) throws IOException {
        return isApproved
                ? imageRepository.approvePostPicture(fileName)
                : imageRepository.rejectPostPicture(fileName);
    }

    private void cleanupTemporaryFile(File tempFile) {
        if (tempFile != null && tempFile.exists()) {
            boolean deleted = tempFile.delete();
            if (!deleted) {
                System.err.println("Impossible de supprimer: " + tempFile.getPath());
            }
        }
    }
}
