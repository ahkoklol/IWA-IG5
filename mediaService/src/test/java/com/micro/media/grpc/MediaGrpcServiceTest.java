package com.micro.media.grpc;

import com.google.protobuf.ByteString;
import com.micro.media.services.MediaGrpcService;
import com.micro.media.services.MediaService;
import io.grpc.ManagedChannel;
import io.grpc.Status;
import io.grpc.StatusRuntimeException;
import io.grpc.inprocess.InProcessChannelBuilder;
import io.grpc.inprocess.InProcessServerBuilder;
import io.grpc.Server;
import org.junit.jupiter.api.*;

import static org.assertj.core.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

class MediaGrpcServiceTest {

    private Server server;
    private ManagedChannel channel;
    private MediaService mediaService;
    private MediaServiceGrpc.MediaServiceBlockingStub stub;

    @BeforeEach
    void setUp() throws Exception {
        String serverName = InProcessServerBuilder.generateName();

        mediaService = mock(MediaService.class);
        MediaGrpcService grpcService = new MediaGrpcService(mediaService);

        server = InProcessServerBuilder.forName(serverName)
                .addService(grpcService)
                .directExecutor()
                .build()
                .start();

        channel = InProcessChannelBuilder.forName(serverName)
                .directExecutor()
                .build();

        stub = MediaServiceGrpc.newBlockingStub(channel);
    }

    @AfterEach
    void tearDown() {
        channel.shutdownNow();
        server.shutdownNow();
    }

    @Test
    void uploadImage_NominalFlow_ReturnsApprovedUrl() {
        // Arrange
        byte[] imageData = {1, 2, 3, 4};
        when(mediaService.uploadImage(any(byte[].class), eq("photo.png"), eq("image/png")))
                .thenReturn("https://final/approved/uuid-photo.png");

        MediaProto.UploadRequest request = MediaProto.UploadRequest.newBuilder()
                .setImage(ByteString.copyFrom(imageData))
                .setFilename("photo.png")
                .setContentType("image/png")
                .build();

        // Act
        MediaProto.UploadResponse response = stub.uploadImage(request);

        // Assert
        assertThat(response.getUrl()).isEqualTo("https://final/approved/uuid-photo.png");
        assertThat(response.getMessage()).isEqualTo("Image traitée avec succès");
        verify(mediaService).uploadImage(imageData, "photo.png", "image/png");
    }

    @Test
    void uploadImage_EmptyImage_ThrowsInvalidArgument() {
        // Arrange
        when(mediaService.uploadImage(any(byte[].class), anyString(), anyString()))
                .thenThrow(new IllegalArgumentException("Fichier vide"));

        MediaProto.UploadRequest request = MediaProto.UploadRequest.newBuilder()
                .setImage(ByteString.EMPTY)
                .setFilename("photo.png")
                .setContentType("image/png")
                .build();

        // Act & Assert
        assertThatThrownBy(() -> stub.uploadImage(request))
                .isInstanceOf(StatusRuntimeException.class)
                .satisfies(ex -> {
                    StatusRuntimeException sre = (StatusRuntimeException) ex;
                    assertThat(sre.getStatus().getCode()).isEqualTo(Status.Code.INVALID_ARGUMENT);
                    assertThat(sre.getStatus().getDescription()).contains("Fichier vide");
                });

        verify(mediaService).uploadImage(any(byte[].class), eq("photo.png"), eq("image/png"));
    }

    @Test
    void uploadImage_EmptyFilename_ThrowsInvalidArgument() {
        // Arrange
        byte[] imageData = {1, 2, 3};
        MediaProto.UploadRequest request = MediaProto.UploadRequest.newBuilder()
                .setImage(ByteString.copyFrom(imageData))
                .setFilename("")
                .setContentType("image/png")
                .build();

        // Act & Assert
        assertThatThrownBy(() -> stub.uploadImage(request))
                .isInstanceOf(StatusRuntimeException.class)
                .satisfies(ex -> {
                    StatusRuntimeException sre = (StatusRuntimeException) ex;
                    assertThat(sre.getStatus().getCode()).isEqualTo(Status.Code.INVALID_ARGUMENT);
                    assertThat(sre.getStatus().getDescription()).contains("nom de fichier est requis");
                });

        verifyNoInteractions(mediaService);
    }

    @Test
    void uploadImage_MissingFilename_ThrowsInvalidArgument() {
        // Arrange - gRPC utilise "" par défaut pour les strings non définis
        byte[] imageData = {1, 2, 3};
        MediaProto.UploadRequest request = MediaProto.UploadRequest.newBuilder()
                .setImage(ByteString.copyFrom(imageData))
                .setContentType("image/png")
                .build();

        // Act & Assert
        assertThatThrownBy(() -> stub.uploadImage(request))
                .isInstanceOf(StatusRuntimeException.class)
                .satisfies(ex -> {
                    StatusRuntimeException sre = (StatusRuntimeException) ex;
                    assertThat(sre.getStatus().getCode()).isEqualTo(Status.Code.INVALID_ARGUMENT);
                    assertThat(sre.getStatus().getDescription()).contains("nom de fichier est requis");
                });

        verifyNoInteractions(mediaService);
    }

    @Test
    void uploadImage_EmptyContentType_ThrowsInvalidArgument() {
        // Arrange
        byte[] imageData = {1, 2, 3};
        when(mediaService.uploadImage(any(byte[].class), anyString(), eq("")))
                .thenThrow(new IllegalArgumentException("Le fichier doit être une image"));

        MediaProto.UploadRequest request = MediaProto.UploadRequest.newBuilder()
                .setImage(ByteString.copyFrom(imageData))
                .setFilename("photo.png")
                .setContentType("")
                .build();

        // Act & Assert
        assertThatThrownBy(() -> stub.uploadImage(request))
                .isInstanceOf(StatusRuntimeException.class)
                .satisfies(ex -> {
                    StatusRuntimeException sre = (StatusRuntimeException) ex;
                    assertThat(sre.getStatus().getCode()).isEqualTo(Status.Code.INVALID_ARGUMENT);
                    assertThat(sre.getStatus().getDescription()).contains("image");
                });

        verify(mediaService).uploadImage(any(byte[].class), eq("photo.png"), eq(""));
    }

    @Test
    void uploadImage_MissingContentType_ThrowsInvalidArgument() {
        // Arrange - gRPC utilise "" par défaut pour les strings non définis
        byte[] imageData = {1, 2, 3};
        when(mediaService.uploadImage(any(byte[].class), anyString(), eq("")))
                .thenThrow(new IllegalArgumentException("Le fichier doit être une image"));

        MediaProto.UploadRequest request = MediaProto.UploadRequest.newBuilder()
                .setImage(ByteString.copyFrom(imageData))
                .setFilename("photo.png")
                .build();

        // Act & Assert
        assertThatThrownBy(() -> stub.uploadImage(request))
                .isInstanceOf(StatusRuntimeException.class)
                .satisfies(ex -> {
                    StatusRuntimeException sre = (StatusRuntimeException) ex;
                    assertThat(sre.getStatus().getCode()).isEqualTo(Status.Code.INVALID_ARGUMENT);
                });

        verify(mediaService).uploadImage(any(byte[].class), eq("photo.png"), eq(""));
    }

    @Test
    void uploadImage_InvalidContentType_ThrowsInvalidArgument() {
        // Arrange
        byte[] imageData = {1, 2, 3};
        when(mediaService.uploadImage(any(byte[].class), anyString(), eq("text/plain")))
                .thenThrow(new IllegalArgumentException("Le fichier doit être une image"));

        MediaProto.UploadRequest request = MediaProto.UploadRequest.newBuilder()
                .setImage(ByteString.copyFrom(imageData))
                .setFilename("doc.txt")
                .setContentType("text/plain")
                .build();

        // Act & Assert
        assertThatThrownBy(() -> stub.uploadImage(request))
                .isInstanceOf(StatusRuntimeException.class)
                .satisfies(ex -> {
                    StatusRuntimeException sre = (StatusRuntimeException) ex;
                    assertThat(sre.getStatus().getCode()).isEqualTo(Status.Code.INVALID_ARGUMENT);
                    assertThat(sre.getStatus().getDescription()).contains("image");
                });
    }

    @Test
    void uploadImage_ImageTooLarge_ThrowsInvalidArgument() {
        // Arrange
        byte[] largeImage = new byte[11 * 1024 * 1024];
        when(mediaService.uploadImage(any(byte[].class), anyString(), anyString()))
                .thenThrow(new IllegalArgumentException("Fichier trop volumineux (max 10MB)"));

        MediaProto.UploadRequest request = MediaProto.UploadRequest.newBuilder()
                .setImage(ByteString.copyFrom(largeImage))
                .setFilename("huge.png")
                .setContentType("image/png")
                .build();

        // Act & Assert
        assertThatThrownBy(() -> stub.uploadImage(request))
                .isInstanceOf(StatusRuntimeException.class)
                .satisfies(ex -> {
                    StatusRuntimeException sre = (StatusRuntimeException) ex;
                    assertThat(sre.getStatus().getCode()).isEqualTo(Status.Code.INVALID_ARGUMENT);
                    assertThat(sre.getStatus().getDescription()).contains("trop volumineux");
                });
    }



    @Test
    void uploadImage_WithExtraFieldsInRequest_WorksNormally() {
        // Arrange - gRPC ignore les champs inconnus ou supplémentaires
        byte[] imageData = {1, 2, 3};
        when(mediaService.uploadImage(any(byte[].class), eq("photo.png"), eq("image/png")))
                .thenReturn("https://final/approved/uuid-photo.png");

        // Note: gRPC en Java ne permet pas facilement d'ajouter des champs arbitraires,
        // mais on peut tester que les champs existants fonctionnent correctement
        MediaProto.UploadRequest request = MediaProto.UploadRequest.newBuilder()
                .setImage(ByteString.copyFrom(imageData))
                .setFilename("photo.png")
                .setContentType("image/png")
                .build();

        // Act
        MediaProto.UploadResponse response = stub.uploadImage(request);

        // Assert
        assertThat(response.getUrl()).isEqualTo("https://final/approved/uuid-photo.png");
        assertThat(response.getMessage()).isEqualTo("Image traitée avec succès");
    }

    @Test
    void uploadImage_RejectedByAI_ReturnsRejectedUrl() {
        // Arrange
        byte[] imageData = {1, 2, 3};
        when(mediaService.uploadImage(any(byte[].class), eq("nsfw.png"), eq("image/png")))
                .thenReturn("https://final/rejected/uuid-nsfw.png");

        MediaProto.UploadRequest request = MediaProto.UploadRequest.newBuilder()
                .setImage(ByteString.copyFrom(imageData))
                .setFilename("nsfw.png")
                .setContentType("image/png")
                .build();

        // Act
        MediaProto.UploadResponse response = stub.uploadImage(request);

        // Assert
        assertThat(response.getUrl()).isEqualTo("https://final/rejected/uuid-nsfw.png");
        assertThat(response.getMessage()).isEqualTo("Image traitée avec succès");
    }

    @Test
    void uploadImage_DifferentImageFormats_WorksForAll() {
        // Arrange
        String[] validFormats = {"image/png", "image/jpeg", "image/webp"};
        byte[] imageData = {1, 2, 3};

        for (String format : validFormats) {
            reset(mediaService);
            when(mediaService.uploadImage(any(byte[].class), anyString(), eq(format)))
                    .thenReturn("https://final/approved/uuid." + format.split("/")[1]);

            MediaProto.UploadRequest request = MediaProto.UploadRequest.newBuilder()
                    .setImage(ByteString.copyFrom(imageData))
                    .setFilename("photo." + format.split("/")[1])
                    .setContentType(format)
                    .build();

            // Act
            MediaProto.UploadResponse response = stub.uploadImage(request);

            // Assert
            assertThat(response.getUrl()).contains("approved");
            verify(mediaService).uploadImage(any(byte[].class), anyString(), eq(format));
        }
    }
}
