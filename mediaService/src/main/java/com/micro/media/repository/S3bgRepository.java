package com.micro.media.repository;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Repository;
import software.amazon.awssdk.core.sync.RequestBody;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.*;
import java.io.File;
import java.io.IOException;
import java.io.InputStream;
import java.nio.file.Paths;



@Repository
public class S3bgRepository implements ImageRepository {

    private final String bucketName;
    private final String region;
    private final S3Client s3Client;



    public S3bgRepository(
            S3Client s3Client,
            @Value("${aws.s3.bucket}") String bucketName,
            @Value("${aws.s3.region:eu-west-1}") String region
    ) {
        this.s3Client = s3Client;
        this.bucketName = bucketName;
        this.region = region;
    }


    @Override
    public String uploadFile(File file, String folder, String fileName) {
        String key = folder + fileName;
        uploadFileToS3(file, key);
        return getPublicUrl(key);
    }

    @Override
    public String uploadFile(InputStream stream, String folder, String fileName) throws IOException {
        String key = folder + fileName;
        PutObjectRequest request = PutObjectRequest.builder()
                .bucket(bucketName)
                .key(key)
                .acl(ObjectCannedACL.PUBLIC_READ)
                .build();

        s3Client.putObject(request, RequestBody.fromInputStream(stream, stream.available()));
        return getPublicUrl(key);
    }

    @Override
    public void delete(String key) {
        DeleteObjectRequest deleteRequest = DeleteObjectRequest.builder()
                .bucket(bucketName)
                .key(key)
                .build();
        s3Client.deleteObject(deleteRequest);
    }

    @Override
    public boolean exists(String key) {
        try {
            HeadObjectRequest headRequest = HeadObjectRequest.builder()
                    .bucket(bucketName)
                    .key(key)
                    .build();
            s3Client.headObject(headRequest);
            return true;
        } catch (NoSuchKeyException e) {
            return false;
        }
    }

    @Override
    public String getPublicUrl(String key) {
        return String.format("https://%s.s3.%s.amazonaws.com/%s", bucketName, region, key);
    }

    private void uploadFileToS3(File file, String key) {
        PutObjectRequest request = PutObjectRequest.builder()
                .bucket(bucketName)
                .key(key)
                .acl(ObjectCannedACL.PUBLIC_READ)
                .build();

        s3Client.putObject(request, Paths.get(file.getPath()));
    }

    private void moveFileInS3(String sourceKey, String destinationKey) {
        CopyObjectRequest copyRequest = CopyObjectRequest.builder()
                .sourceBucket(bucketName)
                .sourceKey(sourceKey)
                .destinationBucket(bucketName)
                .destinationKey(destinationKey)
                .acl(ObjectCannedACL.PUBLIC_READ)
                .build();

        s3Client.copyObject(copyRequest);

        delete(sourceKey);
    }

    @Override
    public String move(String sourceFolder, String sourceFileName, String destinationFolder, String destinationFileName) throws IOException {
        String sourceKey = sourceFolder + sourceFileName;
        String destinationKey = destinationFolder + destinationFileName;
        moveFileInS3(sourceKey, destinationKey);
        return getPublicUrl(destinationKey);
    }

    public String getBucketName() {
        return bucketName;
    }

    public String getRegion() {
        return region;
    }
}
