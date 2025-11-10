package com.micro.media.services;

import com.micro.media.grpc.MediaProto;
import com.micro.media.grpc.MediaServiceGrpc;
import io.grpc.Status;
import io.grpc.stub.StreamObserver;
import net.devh.boot.grpc.server.service.GrpcService;
import org.springframework.beans.factory.annotation.Autowired;

import java.io.IOException;

@GrpcService
public class MediaGrpcService extends MediaServiceGrpc.MediaServiceImplBase {

    private final MediaService mediaService;

    @Autowired
    public MediaGrpcService(MediaService mediaService) {
        this.mediaService = mediaService;
    }

    @Override
    public void uploadPostImage(MediaProto.UploadRequest request,
                                StreamObserver<MediaProto.UploadResponse> responseObserver) {
        try {
            byte[] imageBytes = request.getImage().toByteArray();
            String filename = request.getFilename();
            String contentType = request.getContentType();

            if (filename.isEmpty()) {
                throw new IllegalArgumentException("Le nom de fichier est requis");
            }

            String finalUrl = mediaService.uploadPostImage(imageBytes, filename, contentType);

            MediaProto.UploadResponse response = MediaProto.UploadResponse.newBuilder()
                    .setUrl(finalUrl)
                    .setMessage("Image de post traitée avec succès")
                    .setContentType(contentType)
                    .build();

            responseObserver.onNext(response);
            responseObserver.onCompleted();

        } catch (IllegalArgumentException e) {
            responseObserver.onError(Status.INVALID_ARGUMENT
                    .withDescription(e.getMessage())
                    .asRuntimeException());
        } catch (IOException e) {
            responseObserver.onError(Status.INTERNAL
                    .withDescription("Erreur I/O lors de l'upload")
                    .withCause(e)
                    .asRuntimeException());
        } catch (Exception e) {
            responseObserver.onError(Status.INTERNAL
                    .withDescription("Erreur lors du traitement de l'image")
                    .withCause(e)
                    .asRuntimeException());
        }
    }

    @Override
    public void uploadProfileImage(MediaProto.UploadRequest request,
                                   StreamObserver<MediaProto.UploadResponse> responseObserver) {
        try {
            byte[] imageBytes = request.getImage().toByteArray();
            String filename = request.getFilename();
            String contentType = request.getContentType();

            if (filename.isEmpty()) {
                throw new IllegalArgumentException("Le nom de fichier est requis");
            }

            String finalUrl = mediaService.uploadProfileImage(imageBytes, filename, contentType);

            MediaProto.UploadResponse response = MediaProto.UploadResponse.newBuilder()
                    .setUrl(finalUrl)
                    .setMessage("Image de profil uploadée avec succès")
                    .setContentType(contentType)
                    .build();

            responseObserver.onNext(response);
            responseObserver.onCompleted();

        } catch (IllegalArgumentException e) {
            responseObserver.onError(Status.INVALID_ARGUMENT
                    .withDescription(e.getMessage())
                    .asRuntimeException());
        } catch (IOException e) {
            responseObserver.onError(Status.INTERNAL
                    .withDescription("Erreur I/O lors de l'upload")
                    .withCause(e)
                    .asRuntimeException());
        } catch (Exception e) {
            responseObserver.onError(Status.INTERNAL
                    .withDescription("Erreur lors du traitement de l'image")
                    .withCause(e)
                    .asRuntimeException());
        }
    }
}
