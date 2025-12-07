package com.bg.usermicroservice.client;

import com.micro.media.grpc.UploadRequestProto.UploadRequest;
import com.micro.media.grpc.UploadResponseProto.UploadResponse;
import com.micro.media.grpc.MediaServiceGrpc;
import com.google.protobuf.ByteString;
import org.springframework.stereotype.Component;
import org.springframework.web.multipart.MultipartFile;

@Component
public class MediaClient {

    private final MediaServiceGrpc.MediaServiceBlockingStub stub;

    public MediaClient(MediaServiceGrpc.MediaServiceBlockingStub stub) {
        this.stub = stub;
    }

    public UploadResponse uploadProfileImage(MultipartFile file) {
        try {
            ByteString bytes = ByteString.copyFrom(file.getBytes());
            UploadRequest req = UploadRequest.newBuilder()
                    .setImage(bytes)
                    .setFilename(file.getOriginalFilename() == null ? "file" : file.getOriginalFilename())
                    .setContentType(file.getContentType() == null ? "application/octet-stream" : file.getContentType())
                    .build();

            return stub.uploadProfileImage(req);
        } catch (Exception e) {
            throw new IllegalStateException("Failed to upload image to media service", e);
        }
    }


}