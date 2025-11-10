package com.ai.aimicroservice.client;

import com.ai.aimicroservice.entity.Report;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;

@Component
public class ReportServiceClient {

    private final RestTemplate restTemplate = new RestTemplate();
    private final String baseUrl = "https://example.com/posts/";

    /**
     * Report a post
     * @param report the report entity to send
     * @param postId the id of the post
     */
    public void postReport(Report report, String postId) {
        restTemplate.postForObject(baseUrl + postId, report, Void.class);
    }
}
