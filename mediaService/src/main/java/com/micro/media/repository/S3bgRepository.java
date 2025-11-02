package com.micro.media.repository;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Repository;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.*;
import java.io.File;
import java.nio.file.Paths;

@Repository
public class S3bgRepository {

    private final String bucketName;
    private final String region;
    private final S3Client s3Client;

    private static final String PENDING_FOLDER = "posts/";
    private static final String APPROVED_FOLDER = "archive/";
    private static final String REJECTED_FOLDER = "banned/";

    public S3bgRepository(
            S3Client s3Client,
            @Value("${aws.s3.bucket}") String bucketName,
            @Value("${aws.s3.region:eu-west-1}") String region
    ) {
        this.s3Client = s3Client;
        this.bucketName = bucketName;
        this.region = region;
    }


    /**
     * Upload vers le dossier pending (avant validation IA)
     */
    public String uploadToPendingFolder(File file, String fileName) {
        String key = PENDING_FOLDER + fileName;
        uploadFileToS3(file, key);
        return buildPublicUrl(key);
    }

    /**
     * Déplace de pending vers approved
     */
    public String moveToApprovedFolder(String fileName) {
        String oldKey = PENDING_FOLDER + fileName;
        String newKey = APPROVED_FOLDER + fileName;
        moveFileInS3(oldKey, newKey);
        return buildPublicUrl(newKey);
    }

    /**
     * Déplace de pending vers rejected
     */
    public String moveToRejectedFolder(String fileName) {
        String oldKey = PENDING_FOLDER + fileName;
        String newKey = REJECTED_FOLDER + fileName;
        moveFileInS3(oldKey, newKey);
        return buildPublicUrl(newKey);
    }

    /**
     * Fonction générique d'upload vers S3
     */
    private void uploadFileToS3(File file, String key) {
        PutObjectRequest request = PutObjectRequest.builder()
                .bucket(bucketName)
                .key(key)
                .acl(ObjectCannedACL.PUBLIC_READ) // Rend l'image publique
                .build();

        s3Client.putObject(request, Paths.get(file.getPath()));
    }

    /**
     * Fonction pour déplacer un fichier dans S3
     */
    private void moveFileInS3(String sourceKey, String destinationKey) {
        // Copier vers la nouvelle location
        CopyObjectRequest copyRequest = CopyObjectRequest.builder()
                .sourceBucket(bucketName)
                .sourceKey(sourceKey)
                .destinationBucket(bucketName)
                .destinationKey(destinationKey)
                .acl(ObjectCannedACL.PUBLIC_READ)
                .build();

        s3Client.copyObject(copyRequest);

        // Supprimer l'ancienne version
        DeleteObjectRequest deleteRequest = DeleteObjectRequest.builder()
                .bucket(bucketName)
                .key(sourceKey)
                .build();

        s3Client.deleteObject(deleteRequest);
    }

    /**
     * Construit l'URL publique de l'image
     */
    private String buildPublicUrl(String key) {
        return String.format("https://%s.s3.%s.amazonaws.com/%s", bucketName, region, key);
    }

    public String getBucketName() {
        return bucketName;
    }

    public String getRegion() {
        return region;
    }
}
