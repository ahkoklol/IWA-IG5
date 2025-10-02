package com.ai.aimicroservice.controller;

import com.ai.aimicroservice.service.AIAnalysisService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/ai")
public class AIAnalysisController {

    private static final Logger log = LoggerFactory.getLogger(AIAnalysisController.class);

    private final AIAnalysisService aiAnalysisService;

    public AIAnalysisController(AIAnalysisService aiAnalysisService) {
        this.aiAnalysisService = aiAnalysisService;
    }

    @GetMapping("/{postId}")
    public ResponseEntity<?> getPostId(@PathVariable("postId") String postId) {
        boolean result = aiAnalysisService.analyze(postId);
        return ResponseEntity.ok(result);
    }



}
