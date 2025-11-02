package com.micro.media.controller;

import com.micro.media.services.MediaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/")
public class MediaController {

    @Autowired
    private MediaService mediaService;

    @PostMapping("/upload")
    public ResponseEntity<?> uploadImage(@RequestParam("file") MultipartFile file) {
        try {
            String imageUrl = mediaService.uploadImage(file);
            return ResponseEntity.ok(new ImageUploadResponse(imageUrl, "Image traitée avec succès"));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(new ErrorResponse(e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(new ErrorResponse("Erreur interne du serveur"));
        }
    }

    public static class ImageUploadResponse {
        private String url;
        private String message;

        public ImageUploadResponse(String url, String message) {
            this.url = url;
            this.message = message;
        }

        public String getUrl() { return url; }
        public String getMessage() { return message; }
    }

    public static class ErrorResponse {
        private String error;

        public ErrorResponse(String error) {
            this.error = error;
        }

        public String getError() { return error; }
    }
}
