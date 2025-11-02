package com.micro.media.services;

import com.micro.media.repository.S3bgRepository;
import com.micro.media.services.AIService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.parsing.AliasDefinition;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

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
     * Fonction principale d'upload et validation
     */
    public String uploadImage(MultipartFile file) {
        // 1. Validation du fichier
        validateUploadedFile(file);

        // 2. Créer fichier temporaire
        File tempFile = createTemporaryFile(file);

        try {
            // 3. Générer nom unique
            //TODO: Récupérer nom de l'utilisateur
            String uniqueFileName = generateUniqueFileName(file.getOriginalFilename());

            // 4. Upload vers pending
            String pendingUrl = uploadToPending(tempFile, uniqueFileName);

            // 5. Validation par IA
            AIService.AIServiceResult aiResult = sendImageToAI(tempFile, pendingUrl);

            // 6. Votre validation du résultat IA
            boolean isImageApproved = processAIValidationResult(aiResult);

            // 7. Déplacement vers dossier final
            String finalUrl = moveToFinalDestination(uniqueFileName, isImageApproved);

            return finalUrl;

        } finally {
            // 8. Nettoyage
            cleanupTemporaryFile(tempFile);
        }
    }

    /**
     * Validation du fichier uploadé
     */
    private void validateUploadedFile(MultipartFile file) {
        if (file.isEmpty()) {
            throw new IllegalArgumentException("Fichier vide");
        }

        // Vérification du type MIME
        String contentType = file.getContentType();
        if (contentType == null || !contentType.startsWith("image/")) {
            throw new IllegalArgumentException("Le fichier doit être une image");
        }

        // Vérification de la taille (max 10MB)
        long maxSizeBytes = 10 * 1024 * 1024;
        if (file.getSize() > maxSizeBytes) {
            throw new IllegalArgumentException("Fichier trop volumineux (max 10MB)");
        }

        // Vérification intégrité
        try {
            file.getBytes();
        } catch (IOException e) {
            throw new IllegalArgumentException("Fichier corrompu", e);
        }
    }

    /**
     * Création du fichier temporaire
     */
    private File createTemporaryFile(MultipartFile file) {
        try {
            Path tempDir = Paths.get(System.getProperty("java.io.tmpdir"));
            Path tempFile = Files.createTempFile(tempDir, "upload_", "_" + file.getOriginalFilename());
            file.transferTo(tempFile.toFile());
            return tempFile.toFile();
        } catch (IOException e) {
            throw new RuntimeException("Erreur création fichier temporaire", e);
        }
    }

    /**
     * Génération d'un nom unique pour le fichier
     */
    private String generateUniqueFileName(String originalFilename) {
        String extension = extractFileExtension(originalFilename);
        return UUID.randomUUID().toString() + extension;
    }

    /**
     * Extraction de l'extension du fichier
     */
    private String extractFileExtension(String filename) {
        if (filename != null && filename.contains(".")) {
            return filename.substring(filename.lastIndexOf("."));
        }
        return "";
    }

    /**
     * Upload vers le dossier pending
     */
    private String uploadToPending(File tempFile, String fileName) {
        return s3bgRepository.uploadToPendingFolder(tempFile, fileName);
    }

    /**
     * Envoi de l'image au service IA
     */
    private AIService.AIServiceResult sendImageToAI(File imageFile, String imageUrl) {
        return aiValidationService.sendToAIService(imageFile, imageUrl);
    }

    /**
     * Traitement du résultat de l'IA
     */
    private boolean processAIValidationResult(AIService.AIServiceResult aiResult) {
        return aiValidationService.validateAIResult(aiResult);
    }

    /**
     * Déplacement vers le dossier final selon validation
     */
    private String moveToFinalDestination(String fileName, boolean isApproved) {
        if (isApproved) {
            return moveToApproved(fileName);
        } else {
            return moveToRejected(fileName);
        }
    }

    /**
     * Déplacement vers approved
     */
    private String moveToApproved(String fileName) {
        return s3bgRepository.moveToApprovedFolder(fileName);
    }

    /**
     * Déplacement vers rejected
     */
    private String moveToRejected(String fileName) {
        return s3bgRepository.moveToRejectedFolder(fileName);
    }

    /**
     * Nettoyage du fichier temporaire
     */
    private void cleanupTemporaryFile(File tempFile) {
        if (tempFile != null && tempFile.exists()) {
            boolean deleted = tempFile.delete();
            if (!deleted) {
                System.err.println("Impossible de supprimer le fichier temporaire: " + tempFile.getPath());
            }
        }
    }
}
