package com.micro.media.repository;

import java.io.File;
import java.io.IOException;
import java.io.InputStream;

/**
 * Interface générique pour gérer l'upload et le déplacement d'images.
 * Implémentations possibles : S3, local FS, GCS, etc.
 */
public interface ImageRepository {

    /**
     * Upload d'une image de post (avant validation).
     * @param file fichier local
     * @param fileName nom souhaité du fichier
     * @return URL publique ou clé interne du fichier
     */
    String uploadPostPicture(File file, String fileName);

    /**
     * Upload d'une image de profil utilisateur.
     * @param file fichier local
     * @param fileName nom souhaité du fichier
     * @return URL publique ou clé interne du fichier
     */
    String uploadProfilePicture(File file, String fileName);

    /**
     * Approuve une image de post (déplace vers archive).
     * @param fileName nom du fichier
     * @return URL publique ou clé interne du fichier déplacé
     */
    String approvePostPicture(String fileName);

    /**
     * Rejette une image de post (déplace vers banned).
     * @param fileName nom du fichier
     * @return URL publique ou clé interne du fichier déplacé
     */
    String rejectPostPicture(String fileName);

    /**
     * Upload générique depuis un File vers un dossier donné.
     * @param file fichier local
     * @param folder dossier cible
     * @param fileName nom souhaité du fichier
     * @return URL publique ou clé interne du fichier
     */
    String uploadFile(File file, String folder, String fileName);

    /**
     * Upload générique depuis un InputStream.
     * @param stream contenu du fichier
     * @param folder dossier cible
     * @param fileName nom souhaité du fichier
     * @return URL publique ou clé interne du fichier
     */
    String uploadFile(InputStream stream, String folder, String fileName) throws IOException;

    /**
     * Supprime un fichier par sa clé ou chemin interne.
     * @param key clé/chemin du fichier
     */
    void delete(String key);

    /**
     * Vérifie l'existence d'un fichier.
     * @param key clé/chemin du fichier
     * @return true si existe
     */
    boolean exists(String key);

    /**
     * Construit ou retourne l'URL publique pour une clé/chemin donné.
     * @param key clé/chemin du fichier
     * @return URL publique
     */
    String getPublicUrl(String key);
}
