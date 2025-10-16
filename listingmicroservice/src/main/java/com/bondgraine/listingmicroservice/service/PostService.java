package com.bondgraine.listingmicroservice.service;

import com.bondgraine.listingmicroservice.entity.Post;
import com.bondgraine.listingmicroservice.repository.PostRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.Optional;
import java.util.UUID;

@Service
public class PostService {

    private static final Logger log = LoggerFactory.getLogger(PostService.class);

    private PostRepository postRepository;

    /**
     * Fetch a post by id
     * @param postId the id of the post
     * @return a Post object
     */
    public Optional<Post> getPostById(String postId) {
        return postRepository.findById(postId);
    }

    /**
     * Update a post by id
     * @param postId the id of the post
     * @param post the Post object with updated info
     * @return the updated Post object
     */
    public Post updatePost(String postId, Post post) {

        // Throw NoSuchElementException if post with id postId not found
        getPostById(postId).orElseThrow();
        return postRepository.save(post);
    }

    /**
     * Create a post
     * @param post the Post object to create
     */
    public Post createPost(Post post) {
        post.setPost_id(UUID.randomUUID().toString());
        return postRepository.save(post);
    }

    /**
     * Hide a post - change status to "hidden"
     * @param postId the id of the post
     * @return true if the post was successfully hidden, false otherwise
     */
    public boolean hidePost(String postId) {
        Optional<Post> optionalPost = getPostById(postId);
        return optionalPost.map(post -> {
            // If the post is present (inside the Optional):

            // 3. Apply the required changes (business logic)
            post.setStatus("hidden");
            post.setDate_modified(new Date()); // Update modification timestamp

            // 4. Save the modified entity. Hibernate performs an UPDATE.
            postRepository.save(post);

            // 5. Return true inside the map function, indicating the operation succeeded.
            return true;
        }).orElse(false);
    }
}