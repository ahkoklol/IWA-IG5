package com.micro.media.services;

import com.micro.media.repository.S3bgRepository;
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
    private S3bgRepository s3bgRepository;

    @Autowired
    private AIService aiValidationService;

    /**
     * Upload d'image via gRPC (bytes bruts)
     */
    public String uploadImage(byte[] imageBytes, String originalFilename, String contentType) {
        // 1. Validation
        validateImageBytes(imageBytes, contentType);

        // 2. Fichier temporaire
        File tempFile = createTemporaryFile(imageBytes, originalFilename);

        try {
            // 3. Nom unique
            String uniqueFileName = generateUniqueFileName(originalFilename);

            // 4. Upload pending
            String pendingUrl = uploadToPending(tempFile, uniqueFileName);

            // 5. Validation IA
            AIService.AIServiceResult aiResult = sendImageToAI(tempFile, pendingUrl);

            // 6. Traitement résultat
            boolean isImageApproved = processAIValidationResult(aiResult);

            // 7. Destination finale
            return moveToFinalDestination(uniqueFileName, isImageApproved);

        } finally {
            // 8. Nettoyage
            cleanupTemporaryFile(tempFile);
        }
    }

    /**
     * Validation des bytes d'image
     */
    private void validateImageBytes(byte[] imageBytes, String contentType) {
        if (imageBytes == null || imageBytes.length == 0) {
            throw new IllegalArgumentException("Fichier vide");
        }

        // Type MIME
        if (contentType == null || !contentType.startsWith("image/")) {
            throw new IllegalArgumentException("Le fichier doit être une image");
        }

        // Formats acceptés uniquement
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

        // Taille max 10MB
        long maxSizeBytes = 10 * 1024 * 1024;
        if (imageBytes.length > maxSizeBytes) {
            throw new IllegalArgumentException("Fichier trop volumineux (max 10MB)");
        }
    }



    /**
     * Création fichier temporaire depuis bytes
     */
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

    private String uploadToPending(File tempFile, String fileName) {
        return s3bgRepository.uploadToPendingFolder(tempFile, fileName);
    }

    private AIService.AIServiceResult sendImageToAI(File imageFile, String imageUrl) {
        return aiValidationService.sendToAIService(imageFile, imageUrl);
    }

    private boolean processAIValidationResult(AIService.AIServiceResult aiResult) {
        return aiValidationService.validateAIResult(aiResult);
    }

    private String moveToFinalDestination(String fileName, boolean isApproved) {
        return isApproved
                ? s3bgRepository.moveToApprovedFolder(fileName)
                : s3bgRepository.moveToRejectedFolder(fileName);
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
