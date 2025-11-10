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

import java.io.IOException;

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

    // ==================== Tests pour uploadPostImage ====================

    @Test
    void uploadPostImage_NominalFlow_ReturnsApprovedUrl() throws IOException {
        // Arrange
        byte[] imageData = {1, 2, 3, 4};
        when(mediaService.uploadPostImage(any(byte[].class), eq("photo.png"), eq("image/png")))
                .thenReturn("https://final/approved/uuid-photo.png");

        MediaProto.UploadRequest request = MediaProto.UploadRequest.newBuilder()
                .setImage(ByteString.copyFrom(imageData))
                .setFilename("photo.png")
                .setContentType("image/png")
                .build();

        // Act
        MediaProto.UploadResponse response = stub.uploadPostImage(request);

        // Assert
        assertThat(response.getUrl()).isEqualTo("https://final/approved/uuid-photo.png");
        assertThat(response.getMessage()).isEqualTo("Image de post traitée avec succès");
        verify(mediaService).uploadPostImage(imageData, "photo.png", "image/png");
    }

    @Test
    void uploadPostImage_EmptyImage_ThrowsInvalidArgument() throws IOException {
        // Arrange
        when(mediaService.uploadPostImage(any(byte[].class), anyString(), anyString()))
                .thenThrow(new IllegalArgumentException("Fichier vide"));

        MediaProto.UploadRequest request = MediaProto.UploadRequest.newBuilder()
                .setImage(ByteString.EMPTY)
                .setFilename("photo.png")
                .setContentType("image/png")
                .build();

        // Act & Assert
        assertThatThrownBy(() -> stub.uploadPostImage(request))
                .isInstanceOf(StatusRuntimeException.class)
                .satisfies(ex -> {
                    StatusRuntimeException sre = (StatusRuntimeException) ex;
                    assertThat(sre.getStatus().getCode()).isEqualTo(Status.Code.INVALID_ARGUMENT);
                    assertThat(sre.getStatus().getDescription()).contains("Fichier vide");
                });

        verify(mediaService).uploadPostImage(any(byte[].class), eq("photo.png"), eq("image/png"));
    }

    @Test
    void uploadPostImage_EmptyFilename_ThrowsInvalidArgument() {
        // Arrange
        byte[] imageData = {1, 2, 3};
        MediaProto.UploadRequest request = MediaProto.UploadRequest.newBuilder()
                .setImage(ByteString.copyFrom(imageData))
                .setFilename("")
                .setContentType("image/png")
                .build();

        // Act & Assert
        assertThatThrownBy(() -> stub.uploadPostImage(request))
                .isInstanceOf(StatusRuntimeException.class)
                .satisfies(ex -> {
                    StatusRuntimeException sre = (StatusRuntimeException) ex;
                    assertThat(sre.getStatus().getCode()).isEqualTo(Status.Code.INVALID_ARGUMENT);
                    assertThat(sre.getStatus().getDescription()).contains("nom de fichier est requis");
                });

        verifyNoInteractions(mediaService);
    }

    @Test
    void uploadPostImage_InvalidContentType_ThrowsInvalidArgument() throws IOException {
        // Arrange
        byte[] imageData = {1, 2, 3};
        when(mediaService.uploadPostImage(any(byte[].class), anyString(), eq("text/plain")))
                .thenThrow(new IllegalArgumentException("Le fichier doit être une image"));

        MediaProto.UploadRequest request = MediaProto.UploadRequest.newBuilder()
                .setImage(ByteString.copyFrom(imageData))
                .setFilename("doc.txt")
                .setContentType("text/plain")
                .build();

        // Act & Assert
        assertThatThrownBy(() -> stub.uploadPostImage(request))
                .isInstanceOf(StatusRuntimeException.class)
                .satisfies(ex -> {
                    StatusRuntimeException sre = (StatusRuntimeException) ex;
                    assertThat(sre.getStatus().getCode()).isEqualTo(Status.Code.INVALID_ARGUMENT);
                    assertThat(sre.getStatus().getDescription()).contains("image");
                });
    }

    @Test
    void uploadPostImage_ImageTooLarge_ThrowsInvalidArgument() throws IOException {
        // Arrange
        byte[] largeImage = new byte[11 * 1024 * 1024];
        when(mediaService.uploadPostImage(any(byte[].class), anyString(), anyString()))
                .thenThrow(new IllegalArgumentException("Fichier trop volumineux (max 10MB)"));

        MediaProto.UploadRequest request = MediaProto.UploadRequest.newBuilder()
                .setImage(ByteString.copyFrom(largeImage))
                .setFilename("huge.png")
                .setContentType("image/png")
                .build();

        // Act & Assert
        assertThatThrownBy(() -> stub.uploadPostImage(request))
                .isInstanceOf(StatusRuntimeException.class)
                .satisfies(ex -> {
                    StatusRuntimeException sre = (StatusRuntimeException) ex;
                    assertThat(sre.getStatus().getCode()).isEqualTo(Status.Code.INVALID_ARGUMENT);
                    assertThat(sre.getStatus().getDescription()).contains("trop volumineux");
                });
    }

    @Test
    void uploadPostImage_RejectedByAI_ReturnsRejectedUrl() throws IOException {
        // Arrange
        byte[] imageData = {1, 2, 3};
        when(mediaService.uploadPostImage(any(byte[].class), eq("nsfw.png"), eq("image/png")))
                .thenReturn("https://final/rejected/uuid-nsfw.png");

        MediaProto.UploadRequest request = MediaProto.UploadRequest.newBuilder()
                .setImage(ByteString.copyFrom(imageData))
                .setFilename("nsfw.png")
                .setContentType("image/png")
                .build();

        // Act
        MediaProto.UploadResponse response = stub.uploadPostImage(request);

        // Assert
        assertThat(response.getUrl()).isEqualTo("https://final/rejected/uuid-nsfw.png");
        assertThat(response.getMessage()).isEqualTo("Image de post traitée avec succès");
    }

    @Test
    void uploadPostImage_DifferentImageFormats_WorksForAll() throws IOException {
        // Arrange
        String[] validFormats = {"image/png", "image/jpeg", "image/webp"};
        byte[] imageData = {1, 2, 3};

        for (String format : validFormats) {
            reset(mediaService);
            when(mediaService.uploadPostImage(any(byte[].class), anyString(), eq(format)))
                    .thenReturn("https://final/approved/uuid." + format.split("/")[1]);

            MediaProto.UploadRequest request = MediaProto.UploadRequest.newBuilder()
                    .setImage(ByteString.copyFrom(imageData))
                    .setFilename("photo." + format.split("/")[1])
                    .setContentType(format)
                    .build();

            // Act
            MediaProto.UploadResponse response = stub.uploadPostImage(request);

            // Assert
            assertThat(response.getUrl()).contains("approved");
            verify(mediaService).uploadPostImage(any(byte[].class), anyString(), eq(format));
        }
    }

    @Test
    void uploadPostImage_IOException_ThrowsInternal() throws IOException {
        // Arrange
        byte[] imageData = {1, 2, 3};
        when(mediaService.uploadPostImage(any(byte[].class), anyString(), anyString()))
                .thenThrow(new IOException("S3 connection failed"));

        MediaProto.UploadRequest request = MediaProto.UploadRequest.newBuilder()
                .setImage(ByteString.copyFrom(imageData))
                .setFilename("photo.png")
                .setContentType("image/png")
                .build();

        // Act & Assert
        assertThatThrownBy(() -> stub.uploadPostImage(request))
                .isInstanceOf(StatusRuntimeException.class)
                .satisfies(ex -> {
                    StatusRuntimeException sre = (StatusRuntimeException) ex;
                    assertThat(sre.getStatus().getCode()).isEqualTo(Status.Code.INTERNAL);
                    assertThat(sre.getStatus().getDescription()).contains("Erreur I/O");
                });
    }

    // ==================== Tests pour uploadProfileImage ====================

    @Test
    void uploadProfileImage_NominalFlow_ReturnsUrl() throws IOException {
        // Arrange
        byte[] imageData = {1, 2, 3, 4};
        when(mediaService.uploadProfileImage(any(byte[].class), eq("profile.png"), eq("image/png")))
                .thenReturn("https://profile/uuid-profile.png");

        MediaProto.UploadRequest request = MediaProto.UploadRequest.newBuilder()
                .setImage(ByteString.copyFrom(imageData))
                .setFilename("profile.png")
                .setContentType("image/png")
                .build();

        // Act
        MediaProto.UploadResponse response = stub.uploadProfileImage(request);

        // Assert
        assertThat(response.getUrl()).isEqualTo("https://profile/uuid-profile.png");
        assertThat(response.getMessage()).isEqualTo("Image de profil uploadée avec succès");
        verify(mediaService).uploadProfileImage(imageData, "profile.png", "image/png");
    }

    @Test
    void uploadProfileImage_EmptyImage_ThrowsInvalidArgument() throws IOException {
        // Arrange
        when(mediaService.uploadProfileImage(any(byte[].class), anyString(), anyString()))
                .thenThrow(new IllegalArgumentException("Fichier vide"));

        MediaProto.UploadRequest request = MediaProto.UploadRequest.newBuilder()
                .setImage(ByteString.EMPTY)
                .setFilename("profile.png")
                .setContentType("image/png")
                .build();

        // Act & Assert
        assertThatThrownBy(() -> stub.uploadProfileImage(request))
                .isInstanceOf(StatusRuntimeException.class)
                .satisfies(ex -> {
                    StatusRuntimeException sre = (StatusRuntimeException) ex;
                    assertThat(sre.getStatus().getCode()).isEqualTo(Status.Code.INVALID_ARGUMENT);
                    assertThat(sre.getStatus().getDescription()).contains("Fichier vide");
                });
    }

    @Test
    void uploadProfileImage_EmptyFilename_ThrowsInvalidArgument() {
        // Arrange
        byte[] imageData = {1, 2, 3};
        MediaProto.UploadRequest request = MediaProto.UploadRequest.newBuilder()
                .setImage(ByteString.copyFrom(imageData))
                .setFilename("")
                .setContentType("image/png")
                .build();

        // Act & Assert
        assertThatThrownBy(() -> stub.uploadProfileImage(request))
                .isInstanceOf(StatusRuntimeException.class)
                .satisfies(ex -> {
                    StatusRuntimeException sre = (StatusRuntimeException) ex;
                    assertThat(sre.getStatus().getCode()).isEqualTo(Status.Code.INVALID_ARGUMENT);
                    assertThat(sre.getStatus().getDescription()).contains("nom de fichier est requis");
                });

        verifyNoInteractions(mediaService);
    }

    @Test
    void uploadProfileImage_InvalidContentType_ThrowsInvalidArgument() throws IOException {
        // Arrange
        byte[] imageData = {1, 2, 3};
        when(mediaService.uploadProfileImage(any(byte[].class), anyString(), eq("text/plain")))
                .thenThrow(new IllegalArgumentException("Le fichier doit être une image"));

        MediaProto.UploadRequest request = MediaProto.UploadRequest.newBuilder()
                .setImage(ByteString.copyFrom(imageData))
                .setFilename("doc.txt")
                .setContentType("text/plain")
                .build();

        // Act & Assert
        assertThatThrownBy(() -> stub.uploadProfileImage(request))
                .isInstanceOf(StatusRuntimeException.class)
                .satisfies(ex -> {
                    StatusRuntimeException sre = (StatusRuntimeException) ex;
                    assertThat(sre.getStatus().getCode()).isEqualTo(Status.Code.INVALID_ARGUMENT);
                    assertThat(sre.getStatus().getDescription()).contains("image");
                });
    }

    @Test
    void uploadProfileImage_DifferentImageFormats_WorksForAll() throws IOException {
        // Arrange
        String[] validFormats = {"image/png", "image/jpeg", "image/webp"};
        byte[] imageData = {1, 2, 3};

        for (String format : validFormats) {
            reset(mediaService);
            when(mediaService.uploadProfileImage(any(byte[].class), anyString(), eq(format)))
                    .thenReturn("https://profile/uuid." + format.split("/")[1]);

            MediaProto.UploadRequest request = MediaProto.UploadRequest.newBuilder()
                    .setImage(ByteString.copyFrom(imageData))
                    .setFilename("profile." + format.split("/")[1])
                    .setContentType(format)
                    .build();

            // Act
            MediaProto.UploadResponse response = stub.uploadProfileImage(request);

            // Assert
            assertThat(response.getUrl()).contains("profile");
            verify(mediaService).uploadProfileImage(any(byte[].class), anyString(), eq(format));
        }
    }

    @Test
    void uploadProfileImage_IOException_ThrowsInternal() throws IOException {
        // Arrange
        byte[] imageData = {1, 2, 3};
        when(mediaService.uploadProfileImage(any(byte[].class), anyString(), anyString()))
                .thenThrow(new IOException("S3 connection failed"));

        MediaProto.UploadRequest request = MediaProto.UploadRequest.newBuilder()
                .setImage(ByteString.copyFrom(imageData))
                .setFilename("profile.png")
                .setContentType("image/png")
                .build();

        // Act & Assert
        assertThatThrownBy(() -> stub.uploadProfileImage(request))
                .isInstanceOf(StatusRuntimeException.class)
                .satisfies(ex -> {
                    StatusRuntimeException sre = (StatusRuntimeException) ex;
                    assertThat(sre.getStatus().getCode()).isEqualTo(Status.Code.INTERNAL);
                    assertThat(sre.getStatus().getDescription()).contains("Erreur I/O");
                });
    }
}
