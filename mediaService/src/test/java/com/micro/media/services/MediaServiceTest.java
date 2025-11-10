package com.micro.media.services;

import com.micro.media.repository.ImageRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.*;
import org.mockito.junit.jupiter.MockitoExtension;

import java.io.File;
import java.io.IOException;

import static org.assertj.core.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class MediaServiceTest {

    @InjectMocks
    private MediaService mediaService;

    @Mock
    private ImageRepository imageRepository;

    @Mock
    private AIService aiValidationService;

    @Test
    void uploadPostImage_Approved_Flow_OK_and_tempFile_deleted() throws IOException {
        byte[] imageBytes = {1, 2, 3};
        String filename = "photo.png";
        String contentType = "image/png";

        when(imageRepository.uploadPostPicture(any(File.class), anyString()))
                .thenReturn("https://pending/url");
        AIService.AIServiceResult aiRes = mock(AIService.AIServiceResult.class);
        when(aiValidationService.sendToAIService(any(File.class), eq("https://pending/url")))
                .thenReturn(aiRes);
        when(aiValidationService.validateAIResult(aiRes)).thenReturn(true);
        when(imageRepository.approvePostPicture(anyString()))
                .thenAnswer(inv -> "https://final/approved/" + inv.getArgument(0));

        ArgumentCaptor<File> tempFileCaptor = ArgumentCaptor.forClass(File.class);
        String finalUrl = mediaService.uploadPostImage(imageBytes, filename, contentType);

        assertThat(finalUrl).startsWith("https://final/approved/");

        verify(imageRepository).uploadPostPicture(tempFileCaptor.capture(), anyString());
        verify(aiValidationService).sendToAIService(any(File.class), eq("https://pending/url"));
        verify(aiValidationService).validateAIResult(aiRes);
        verify(imageRepository).approvePostPicture(anyString());
        verify(imageRepository, never()).rejectPostPicture(anyString());

        assertThat(tempFileCaptor.getValue().exists()).isFalse();
    }

    @Test
    void uploadPostImage_Rejected_Flow_OK() throws IOException {
        byte[] imageBytes = {1, 2, 3};
        String filename = "photo.png";
        String contentType = "image/png";

        when(imageRepository.uploadPostPicture(any(File.class), anyString()))
                .thenReturn("https://pending/url");
        AIService.AIServiceResult aiRes = mock(AIService.AIServiceResult.class);
        when(aiValidationService.sendToAIService(any(File.class), anyString()))
                .thenReturn(aiRes);
        when(aiValidationService.validateAIResult(aiRes)).thenReturn(false);
        when(imageRepository.rejectPostPicture(anyString()))
                .thenAnswer(inv -> "https://final/rejected/" + inv.getArgument(0));

        String finalUrl = mediaService.uploadPostImage(imageBytes, filename, contentType);

        assertThat(finalUrl).startsWith("https://final/rejected/");
        verify(imageRepository).rejectPostPicture(anyString());
        verify(imageRepository, never()).approvePostPicture(anyString());
    }

    @Test
    void uploadPostImage_EmptyBytes_throws() {
        assertThatThrownBy(() -> mediaService.uploadPostImage(
                new byte[0], "photo.png", "image/png"))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining("Fichier vide");
        verifyNoInteractions(imageRepository, aiValidationService);
    }

    @Test
    void uploadPostImage_NullBytes_throws() {
        assertThatThrownBy(() -> mediaService.uploadPostImage(
                null, "photo.png", "image/png"))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining("Fichier vide");
        verifyNoInteractions(imageRepository, aiValidationService);
    }

    @Test
    void uploadPostImage_WrongMime_throws() {
        byte[] bytes = {1, 2, 3};
        assertThatThrownBy(() -> mediaService.uploadPostImage(
                bytes, "note.txt", "text/plain"))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining("image");
        verifyNoInteractions(imageRepository, aiValidationService);
    }

    @Test
    void uploadPostImage_NullContentType_throws() {
        byte[] bytes = {1, 2, 3};
        assertThatThrownBy(() -> mediaService.uploadPostImage(
                bytes, "photo.png", null))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining("image");
        verifyNoInteractions(imageRepository, aiValidationService);
    }

    @Test
    void uploadPostImage_GifFormat_throws() {
        byte[] bytes = {1, 2, 3};
        assertThatThrownBy(() -> mediaService.uploadPostImage(
                bytes, "animation.gif", "image/gif"))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining("image");
        verifyNoInteractions(imageRepository, aiValidationService);
    }

    @Test
    void uploadPostImage_TooLarge_throws() {
        byte[] bigBytes = new byte[11 * 1024 * 1024];
        assertThatThrownBy(() -> mediaService.uploadPostImage(
                bigBytes, "huge.png", "image/png"))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining("trop volumineux");
        verifyNoInteractions(imageRepository, aiValidationService);
    }

    @Test
    void uploadPostImage_ExactlyMaxSize_OK() throws IOException {
        byte[] maxBytes = new byte[10 * 1024 * 1024];
        when(imageRepository.uploadPostPicture(any(File.class), anyString()))
                .thenReturn("https://pending/url");
        AIService.AIServiceResult aiRes = mock(AIService.AIServiceResult.class);
        when(aiValidationService.sendToAIService(any(File.class), anyString()))
                .thenReturn(aiRes);
        when(aiValidationService.validateAIResult(aiRes)).thenReturn(true);
        when(imageRepository.approvePostPicture(anyString()))
                .thenReturn("https://final/approved/xxx");

        assertThatCode(() -> mediaService.uploadPostImage(maxBytes, "max.png", "image/png"))
                .doesNotThrowAnyException();
    }

    @Test
    void uploadPostImage_ValidImageFormats_OK() throws IOException {
        String[][] validFormats = {
                {"image/png", "test.png"},
                {"image/jpeg", "test.jpeg"},
                {"image/jpg", "test.jpg"},
                {"image/webp", "test.webp"}
        };

        for (String[] format : validFormats) {
            String contentType = format[0];
            String filename = format[1];

            byte[] bytes = {1, 2, 3};
            when(imageRepository.uploadPostPicture(any(File.class), anyString()))
                    .thenReturn("https://pending/url");
            AIService.AIServiceResult aiRes = mock(AIService.AIServiceResult.class);
            when(aiValidationService.sendToAIService(any(File.class), anyString()))
                    .thenReturn(aiRes);
            when(aiValidationService.validateAIResult(aiRes)).thenReturn(true);
            when(imageRepository.approvePostPicture(anyString()))
                    .thenReturn("https://final/approved/xxx");

            assertThatCode(() -> mediaService.uploadPostImage(bytes, filename, contentType))
                    .as("Format %s devrait être accepté", contentType)
                    .doesNotThrowAnyException();

            clearInvocations(imageRepository, aiValidationService);
        }
    }

    @Test
    void uploadPostImage_InvalidImageFormats_throws() {
        String[][] invalidFormats = {
                {"image/gif", "test.gif"},
                {"image/svg+xml", "test.svg"},
                {"image/bmp", "test.bmp"},
                {"image/tiff", "test.tiff"}
        };

        for (String[] format : invalidFormats) {
            String contentType = format[0];
            String filename = format[1];

            byte[] bytes = {1, 2, 3};
            assertThatThrownBy(() -> mediaService.uploadPostImage(bytes, filename, contentType))
                    .as("Format %s devrait être rejeté", contentType)
                    .isInstanceOf(IllegalArgumentException.class)
                    .hasMessageContaining("image");
        }
        verifyNoInteractions(imageRepository, aiValidationService);
    }

    @Test
    void uploadProfileImage_OK() throws IOException {
        byte[] imageBytes = {1, 2, 3};
        String filename = "profile.png";
        String contentType = "image/png";

        when(imageRepository.uploadProfilePicture(any(File.class), anyString()))
                .thenReturn("https://profile/url/xxx.png");

        ArgumentCaptor<File> tempFileCaptor = ArgumentCaptor.forClass(File.class);
        String finalUrl = mediaService.uploadProfileImage(imageBytes, filename, contentType);

        assertThat(finalUrl).isEqualTo("https://profile/url/xxx.png");

        verify(imageRepository).uploadProfilePicture(tempFileCaptor.capture(), anyString());
        verifyNoInteractions(aiValidationService);

        assertThat(tempFileCaptor.getValue().exists()).isFalse();
    }

    @Test
    void uploadProfileImage_EmptyBytes_throws() {
        assertThatThrownBy(() -> mediaService.uploadProfileImage(
                new byte[0], "profile.png", "image/png"))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining("Fichier vide");
        verifyNoInteractions(imageRepository, aiValidationService);
    }

    @Test
    void uploadProfileImage_InvalidFormat_throws() {
        byte[] bytes = {1, 2, 3};
        assertThatThrownBy(() -> mediaService.uploadProfileImage(
                bytes, "profile.gif", "image/gif"))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining("image");
        verifyNoInteractions(imageRepository, aiValidationService);
    }
}
