package com.micro.media.services;

import com.micro.media.grpc.MediaProto;
import com.micro.media.grpc.MediaServiceGrpc;
import io.grpc.Status;
import io.grpc.stub.StreamObserver;
import net.devh.boot.grpc.server.service.GrpcService;
import org.springframework.beans.factory.annotation.Autowired;

import java.io.IOException;

/**
 * Implémentation gRPC du service MediaService.
 * Gère les appels gRPC pour l'upload d'images (posts et profils).
 * Délègue la logique métier à MediaService et transforme les exceptions en erreurs gRPC.
 */
@GrpcService
public class MediaServiceImpl extends MediaServiceGrpc.MediaServiceImplBase {

    private final MediaService mediaService;

    @Autowired
    public MediaServiceImpl(MediaService mediaService) {
        this.mediaService = mediaService;
    }

    /**
     * Gère l'upload d'une image de post via gRPC.
     * Reçoit les bytes de l'image, délègue le traitement (compression, validation IA, upload S3)
     * au service métier et retourne l'URL finale.
     *
     * @param request requête gRPC contenant l'image (bytes), le nom de fichier et le type MIME
     * @param responseObserver observer pour envoyer la réponse (URL) ou une erreur
     */
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

    /**
     * Gère l'upload d'une image de profil via gRPC.
     * Reçoit les bytes de l'image, délègue le traitement (compression, validation IA, upload S3)
     * au service métier et retourne l'URL finale.
     *
     * @param request requête gRPC contenant l'image (bytes), le nom de fichier et le type MIME
     * @param responseObserver observer pour envoyer la réponse (URL) ou une erreur
     */
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
