package com.micro.media.services;

import com.micro.media.grpc.MediaProto;
import com.micro.media.grpc.MediaServiceGrpc;
import io.grpc.Status;
import io.grpc.stub.StreamObserver;
import net.devh.boot.grpc.server.service.GrpcService;
import org.springframework.beans.factory.annotation.Autowired;

@GrpcService
public class MediaGrpcService extends MediaServiceGrpc.MediaServiceImplBase {

    MediaService mediaService;

    @Autowired
    public MediaGrpcService(MediaService mediaService) {
        this.mediaService = mediaService;
    }

    @Override
    public void uploadImage(MediaProto.UploadRequest request,
                            StreamObserver<MediaProto.UploadResponse> responseObserver) {
        try {
            // Extraction des données de la requête
            byte[] imageBytes = request.getImage().toByteArray();
            String filename = request.getFilename();
            String contentType = request.getContentType();

            // Validation basique côté gRPC
            if (filename.isEmpty()) {
                throw new IllegalArgumentException("Le nom de fichier est requis");
            }

            // Appel du service métier
            String finalUrl = mediaService.uploadImage(imageBytes, filename, contentType);

            // Construction de la réponse de succès
            MediaProto.UploadResponse response = MediaProto.UploadResponse.newBuilder()
                    .setUrl(finalUrl)
                    .setMessage("Image traitée avec succès")
                    .build();

            responseObserver.onNext(response);
            responseObserver.onCompleted();

        } catch (IllegalArgumentException e) {
            // Erreurs de validation (400-like)
            responseObserver.onError(Status.INVALID_ARGUMENT
                    .withDescription(e.getMessage())
                    .asRuntimeException());

        }

        catch (Exception e) {
            // Erreurs internes (500-like)
            responseObserver.onError(Status.INTERNAL
                    .withDescription("Erreur lors du traitement de l'image")
                    .withCause(e)
                    .asRuntimeException());
        }
    }
}
