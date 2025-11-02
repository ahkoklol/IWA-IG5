package com.micro.media.services;

import com.micro.media.grpc.MediaProto;
import com.micro.media.grpc.MediaServiceGrpc;
import io.grpc.stub.StreamObserver;
import net.devh.boot.grpc.server.service.GrpcService;
import org.springframework.beans.factory.annotation.Autowired;
import com.micro.media.repository.S3bgRepository;

@GrpcService
public class MediaGrpcService extends MediaServiceGrpc.MediaServiceImplBase {

    @Autowired
    private S3bgRepository s3bgRepository;

    @Autowired
    private AIService aiService;

    @Override
    public void uploadImage(MediaProto.UploadRequest request,
                            StreamObserver<MediaProto.UploadResponse> responseObserver) {
        try {
            byte[] imageBytes = request.getImage().toByteArray();
            String filename = request.getFilename();

            // TODO: Adapter MediaService pour accepter byte[] au lieu de MultipartFile
            // Pour l'instant, retour basique
            String url = "pending/image-uploaded";

            MediaProto.UploadResponse response = MediaProto.UploadResponse.newBuilder()
                    .setUrl(url)
                    .setMessage("Image reçue et en attente de validation")
                    .build();

            responseObserver.onNext(response);
            responseObserver.onCompleted();

        } catch (Exception e) {
            MediaProto.UploadResponse errorResponse = MediaProto.UploadResponse.newBuilder()
                    .setUrl("")
                    .setMessage("Erreur: " + e.getMessage())
                    .build();

            responseObserver.onNext(errorResponse);
            responseObserver.onCompleted();
        }
    }
}
