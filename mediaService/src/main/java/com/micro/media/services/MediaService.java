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

/**
 * Service de gestion des médias (images de profil et de posts).
 * Gère l'upload, la validation et le déplacement des images via le repository.
 */
@Service
public class MediaService {

    private static final String PENDING_FOLDER = "posts/";
    private static final String APPROVED_FOLDER = "archive/";
    private static final String REJECTED_FOLDER = "banned/";
    private static final String PROFILE_FOLDER = "profile/";

    @Autowired
    private ImageRepository imageRepository;

    @Autowired
    private AIService aiValidationService;

    /**
     * Upload une image de post avec validation IA.
     * L'image est d'abord uploadée dans un dossier temporaire (pending),
     * validée par l'IA, puis déplacée vers archive/ (approuvée) ou banned/ (rejetée).
     *
     * @param imageBytes contenu binaire de l'image
     * @param originalFilename nom original du fichier
     * @param contentType type MIME de l'image (ex: image/png)
     * @return URL publique de l'image dans son dossier final
     * @throws IOException en cas d'erreur d'upload ou de déplacement
     * @throws IllegalArgumentException si l'image est invalide (format, taille, etc.)
     */
    public String uploadPostImage(byte[] imageBytes, String originalFilename, String contentType) throws IOException {
        validateImageBytes(imageBytes, contentType);
        File tempFile = createTemporaryFile(imageBytes, originalFilename);

        try {
            String uniqueFileName = generateUniqueFileName(originalFilename);
            String pendingUrl = imageRepository.uploadFile(tempFile, PENDING_FOLDER, uniqueFileName);
            boolean isImageApproved = aiValidationService.validateImage(tempFile, pendingUrl);
            return moveToFinalDestination(uniqueFileName, isImageApproved);
        } finally {
            cleanupTemporaryFile(tempFile);
        }
    }

    /**
     * Upload une image de profil sans validation IA.
     * L'image est directement uploadée dans le dossier profile/.
     *
     * @param imageBytes contenu binaire de l'image
     * @param originalFilename nom original du fichier
     * @param contentType type MIME de l'image (ex: image/jpeg)
     * @return URL publique de l'image de profil
     * @throws IOException en cas d'erreur d'upload
     * @throws IllegalArgumentException si l'image est invalide (format, taille, etc.)
     */
    public String uploadProfileImage(byte[] imageBytes, String originalFilename, String contentType) throws IOException {
        validateImageBytes(imageBytes, contentType);
        File tempFile = createTemporaryFile(imageBytes, originalFilename);

        try {
            String uniqueFileName = generateUniqueFileName(originalFilename);
            return imageRepository.uploadFile(tempFile, PROFILE_FOLDER, uniqueFileName);
        } finally {
            cleanupTemporaryFile(tempFile);
        }
    }

    /**
     * Valide les bytes de l'image (taille, format, type MIME).
     *
     * @param imageBytes contenu binaire de l'image
     * @param contentType type MIME de l'image
     * @throws IllegalArgumentException si l'image est vide, trop volumineuse ou d'un format non supporté
     */
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

    /**
     * Crée un fichier temporaire à partir des bytes de l'image.
     *
     * @param imageBytes contenu binaire de l'image
     * @param originalFilename nom original du fichier (utilisé pour le suffixe)
     * @return fichier temporaire créé
     * @throws RuntimeException si la création échoue
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

    /**
     * Génère un nom de fichier unique basé sur un UUID + extension d'origine.
     *
     * @param originalFilename nom original du fichier
     * @return nom de fichier unique (UUID + extension)
     */
    private String generateUniqueFileName(String originalFilename) {
        String extension = extractFileExtension(originalFilename);
        return UUID.randomUUID().toString() + extension;
    }

    /**
     * Extrait l'extension d'un nom de fichier.
     *
     * @param filename nom du fichier
     * @return extension (avec le point), ou chaîne vide si aucune extension
     */
    private String extractFileExtension(String filename) {
        if (filename != null && filename.contains(".")) {
            return filename.substring(filename.lastIndexOf("."));
        }
        return "";
    }


    /**
     * Déplace l'image vers son dossier final (archive/ ou banned/) selon l'approbation.
     *
     * @param fileName nom du fichier à déplacer
     * @param isApproved true pour déplacer vers archive/, false pour banned/
     * @return URL publique de l'image déplacée
     * @throws IOException en cas d'erreur de déplacement
     */
    private String moveToFinalDestination(String fileName, boolean isApproved) throws IOException {
        String destinationFolder = isApproved ? APPROVED_FOLDER : REJECTED_FOLDER;
        return imageRepository.move(PENDING_FOLDER, fileName, destinationFolder, fileName);
    }

    /**
     * Supprime le fichier temporaire après usage.
     *
     * @param tempFile fichier temporaire à supprimer
     */
    private void cleanupTemporaryFile(File tempFile) {
        if (tempFile != null && tempFile.exists()) {
            boolean deleted = tempFile.delete();
            if (!deleted) {
                System.err.println("Impossible de supprimer: " + tempFile.getPath());
            }
        }
    }
}
