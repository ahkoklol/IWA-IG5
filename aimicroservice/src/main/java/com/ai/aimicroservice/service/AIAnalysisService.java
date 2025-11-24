package com.ai.aimicroservice.service;

import com.ai.aimicroservice.client.ListingClient;
import com.ai.aimicroservice.entity.PostDTO;
import com.ai.aimicroservice.entity.Report;
import com.bondgraine.listingmicroservice.grpc.GetPostRequest;
import com.bondgraine.listingmicroservice.grpc.GetPostResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.util.Date;

@Service
public class AIAnalysisService {

    private static final Logger log = LoggerFactory.getLogger(AIAnalysisService.class);

    private final ListingClient listingClient;
    private final ReportServiceClient reportServiceClient;
    private final TextAnalysisService textAnalysisService;
    private final ImageAnalysisService imageAnalysisService;

    public AIAnalysisService(ListingClient listingClient, ReportServiceClient reportServiceClient, TextAnalysisService textAnalysisService, ImageAnalysisService imageAnalysisService) {
        this.listingClient = listingClient;
        this.reportServiceClient = reportServiceClient;
        this.textAnalysisService = textAnalysisService;
        this.imageAnalysisService = imageAnalysisService;
    }

    /**
     * Analyze a post description and image
     * @param postId the id of a post
     * @return true if the post passes the check, false otherwise
     */
    public boolean analyze(String postId, String fileName, byte[] file) {
        GetPostRequest getPostRequest = GetPostRequest.newBuilder()
                .setPostId(postId)
                .build();
        GetPostResponse getPostResponse = listingClient.getPost(getPostRequest);

        PostDTO post = new PostDTO();
        post.setPostId(getPostResponse.getPostId());
        post.setDescription(getPostResponse.getDescription());
        post.setImageName(fileName);

        // text analysis
        String textAnalysis = textAnalysisService.analyzeText(post.getDescription());
        String textAnalysisReasoning = textAnalysisService.extractReasoning(textAnalysis);
        boolean textVerdict = textAnalysisService.extractVerdictText(textAnalysis);

        // image analysis
        String imageAnalysisResult = imageAnalysisService.analyzeImage(file);
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
