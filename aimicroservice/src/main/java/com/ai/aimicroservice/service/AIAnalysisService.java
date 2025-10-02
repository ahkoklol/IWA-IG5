package com.ai.aimicroservice.service;

import com.ai.aimicroservice.client.PostServiceClient;
import com.ai.aimicroservice.client.ReportServiceClient;
import com.ai.aimicroservice.entity.Post;
import com.ai.aimicroservice.entity.Report;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.util.Date;

@Service
public class AIAnalysisService {

    private static final Logger log = LoggerFactory.getLogger(AIAnalysisService.class);

    private final PostServiceClient postServiceClient;
    private final ReportServiceClient reportServiceClient;
    private final TextAnalysisService textAnalysisService;
    private final ImageAnalysisService imageAnalysisService;

    public AIAnalysisService(PostServiceClient postServiceClient, ReportServiceClient reportServiceClient, TextAnalysisService textAnalysisService, ImageAnalysisService imageAnalysisService) {
        this.postServiceClient = postServiceClient;
        this.reportServiceClient = reportServiceClient;
        this.textAnalysisService = textAnalysisService;
        this.imageAnalysisService = imageAnalysisService;
    }

    /**
     * Analyze a post description and image
     * @param postId the id of a post
     * @return true if the post passes the check, false otherwise
     */
    public boolean analyze(String postId) {
        Post post = postServiceClient.getPost(postId);

        // text analysis
        String textAnalysis = textAnalysisService.analyzeText(post.getDescription());
        String textAnalysisReasoning = textAnalysisService.extractReasoning(textAnalysis);
        boolean textVerdict = textAnalysisService.extractVerdictText(textAnalysis);

        // image analysis
        String imageAnalysisResult = imageAnalysisService.analyzeImage(post.getImageName());
        String imageAnalysisLabels = imageAnalysisService.extractLabels(imageAnalysisResult);
        boolean imageVerdict = imageAnalysisService.extractVerdictImage(imageAnalysisResult);

        // split the result
        boolean analysisResult = true;

        if (textVerdict || imageVerdict) {
            analysisResult = false;
            report(postId, textAnalysisReasoning + " " + imageAnalysisLabels);
        }

        return analysisResult;
    }

    /**
     * Report a post due to inappropriate content
     * @param postId the id of the post to report
     */
    private void report(String postId, String description) {
        Report report = new Report();
        report.setDescription(description);
        report.setType("ai");
        report.setDate(new Date());
        reportServiceClient.postReport(report, postId);
    }
}
