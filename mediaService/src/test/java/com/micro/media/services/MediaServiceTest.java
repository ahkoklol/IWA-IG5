package com.micro.media.services;

import com.micro.media.repository.S3bgRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.*;
import org.mockito.junit.jupiter.MockitoExtension;

import java.io.File;

import static org.assertj.core.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class MediaServiceTest {

    @InjectMocks
    private MediaService mediaService;

    @Mock
    private S3bgRepository s3bgRepository;

    @Mock
    private AIService aiValidationService;

    @Test
    void uploadImage_Approved_Flow_OK_and_tempFile_deleted() {
        byte[] imageBytes = {1, 2, 3};
        String filename = "photo.png";
        String contentType = "image/png";

        when(s3bgRepository.uploadToPendingFolder(any(File.class), anyString()))
                .thenReturn("https://pending/url");
        AIService.AIServiceResult aiRes = mock(AIService.AIServiceResult.class);
        when(aiValidationService.sendToAIService(any(File.class), eq("https://pending/url")))
                .thenReturn(aiRes);
        when(aiValidationService.validateAIResult(aiRes)).thenReturn(true);
        when(s3bgRepository.moveToApprovedFolder(anyString()))
                .thenAnswer(inv -> "https://final/approved/" + inv.getArgument(0));

        ArgumentCaptor<File> tempFileCaptor = ArgumentCaptor.forClass(File.class);
        String finalUrl = mediaService.uploadImage(imageBytes, filename, contentType);

        assertThat(finalUrl).startsWith("https://final/approved/");

        verify(s3bgRepository).uploadToPendingFolder(tempFileCaptor.capture(), anyString());
        verify(aiValidationService).sendToAIService(any(File.class), eq("https://pending/url"));
        verify(aiValidationService).validateAIResult(aiRes);
        verify(s3bgRepository).moveToApprovedFolder(anyString());
        verify(s3bgRepository, never()).moveToRejectedFolder(anyString());

        assertThat(tempFileCaptor.getValue().exists()).isFalse();
    }

    @Test
    void uploadImage_Rejected_Flow_OK() {
        byte[] imageBytes = {1, 2, 3};
        String filename = "photo.png";
        String contentType = "image/png";

        when(s3bgRepository.uploadToPendingFolder(any(File.class), anyString()))
                .thenReturn("https://pending/url");
        AIService.AIServiceResult aiRes = mock(AIService.AIServiceResult.class);
        when(aiValidationService.sendToAIService(any(File.class), anyString()))
                .thenReturn(aiRes);
        when(aiValidationService.validateAIResult(aiRes)).thenReturn(false);
        when(s3bgRepository.moveToRejectedFolder(anyString()))
                .thenAnswer(inv -> "https://final/rejected/" + inv.getArgument(0));

        String finalUrl = mediaService.uploadImage(imageBytes, filename, contentType);

        assertThat(finalUrl).startsWith("https://final/rejected/");
        verify(s3bgRepository).moveToRejectedFolder(anyString());
        verify(s3bgRepository, never()).moveToApprovedFolder(anyString());
    }

    @Test
    void uploadImage_EmptyBytes_throws() {
        assertThatThrownBy(() -> mediaService.uploadImage(
                new byte[0], "photo.png", "image/png"))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining("Fichier vide");
        verifyNoInteractions(s3bgRepository, aiValidationService);
    }

    @Test
    void uploadImage_NullBytes_throws() {
        assertThatThrownBy(() -> mediaService.uploadImage(
                null, "photo.png", "image/png"))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining("Fichier vide");
        verifyNoInteractions(s3bgRepository, aiValidationService);
    }

    @Test
    void uploadImage_WrongMime_throws() {
        byte[] bytes = {1, 2, 3};
        assertThatThrownBy(() -> mediaService.uploadImage(
                bytes, "note.txt", "text/plain"))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining("image");
        verifyNoInteractions(s3bgRepository, aiValidationService);
    }

    @Test
    void uploadImage_NullContentType_throws() {
        byte[] bytes = {1, 2, 3};
        assertThatThrownBy(() -> mediaService.uploadImage(
                bytes, "photo.png", null))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining("image");
        verifyNoInteractions(s3bgRepository, aiValidationService);
    }

    @Test
    void uploadImage_GifFormat_throws() {
        byte[] bytes = {1, 2, 3};
        assertThatThrownBy(() -> mediaService.uploadImage(
                bytes, "animation.gif", "image/gif"))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining("image");
        verifyNoInteractions(s3bgRepository, aiValidationService);
    }

    @Test
    void uploadImage_TooLarge_throws() {
        byte[] bigBytes = new byte[11 * 1024 * 1024];
        assertThatThrownBy(() -> mediaService.uploadImage(
                bigBytes, "huge.png", "image/png"))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining("trop volumineux");
        verifyNoInteractions(s3bgRepository, aiValidationService);
    }

    @Test
    void uploadImage_ExactlyMaxSize_OK() {
        byte[] maxBytes = new byte[10 * 1024 * 1024];
        when(s3bgRepository.uploadToPendingFolder(any(File.class), anyString()))
                .thenReturn("https://pending/url");
        AIService.AIServiceResult aiRes = mock(AIService.AIServiceResult.class);
        when(aiValidationService.sendToAIService(any(File.class), anyString()))
                .thenReturn(aiRes);
        when(aiValidationService.validateAIResult(aiRes)).thenReturn(true);
        when(s3bgRepository.moveToApprovedFolder(anyString()))
                .thenReturn("https://final/approved/xxx");

        assertThatCode(() -> mediaService.uploadImage(maxBytes, "max.png", "image/png"))
                .doesNotThrowAnyException();
    }

    @Test
    void uploadImage_ValidImageFormats_OK() {
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
            when(s3bgRepository.uploadToPendingFolder(any(File.class), anyString()))
                    .thenReturn("https://pending/url");
            AIService.AIServiceResult aiRes = mock(AIService.AIServiceResult.class);
            when(aiValidationService.sendToAIService(any(File.class), anyString()))
                    .thenReturn(aiRes);
            when(aiValidationService.validateAIResult(aiRes)).thenReturn(true);
            when(s3bgRepository.moveToApprovedFolder(anyString()))
                    .thenReturn("https://final/approved/xxx");

            assertThatCode(() -> mediaService.uploadImage(bytes, filename, contentType))
                    .as("Format %s devrait être accepté", contentType)
                    .doesNotThrowAnyException();

            clearInvocations(s3bgRepository, aiValidationService);
        }
    }

    @Test
    void uploadImage_InvalidImageFormats_throws() {
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
            assertThatThrownBy(() -> mediaService.uploadImage(bytes, filename, contentType))
                    .as("Format %s devrait être rejeté", contentType)
                    .isInstanceOf(IllegalArgumentException.class)
                    .hasMessageContaining("image");
        }
        verifyNoInteractions(s3bgRepository, aiValidationService);
    }
}