package com.ai.aimicroservice.client;

import com.ai.aimicroservice.entity.Post;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;

@Component
public class PostServiceClient {

    private final RestTemplate restTemplate = new RestTemplate();
    private final String baseUrl = "https://example.com/post/";

    /**
     * Maps a post to a Post entity
     * @param postId the id of the post
     * @return a Post entity
     */
    public Post getPost(String postId) {
        return restTemplate.getForObject(baseUrl + postId, Post.class);
    }
}