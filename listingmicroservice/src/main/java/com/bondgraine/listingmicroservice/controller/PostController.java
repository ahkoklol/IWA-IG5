package com.bondgraine.listingmicroservice.controller;

import com.bondgraine.listingmicroservice.entity.FavouriteId;
import com.bondgraine.listingmicroservice.entity.Post;
import com.bondgraine.listingmicroservice.service.PostService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/post")
public class PostController {

    private static final Logger log = LoggerFactory.getLogger(PostController.class);

    private final PostService postService;

    public PostController(PostService postService) {
        this.postService = postService;
    }

    @GetMapping("/{postId}")
    public ResponseEntity<Post> getPost(@PathVariable("postId") String postId) {
        log.info("Request to get post with id {}", postId);
        return postService.getPostById(postId)
                .map(ResponseEntity::ok) // 200 OK with body
                .orElseGet(() -> ResponseEntity.notFound().build()); // 404 Not Found
    }

    @PatchMapping("/{postId}")
    public ResponseEntity<Post> updatePost(@RequestBody Post post, @PathVariable String postId) {
        log.info("Received request to edit post: {}", post);
        // The JSON payload is automatically mapped to the 'Post' object
        Post updatedPost = postService.updatePost(postId, post);

        if (updatedPost != null) {
            log.info("Updated post with id {}", postId);
            return ResponseEntity.ok(updatedPost); // 200 ok with updated entity
        } else {
            return ResponseEntity.notFound().build(); // 404 not found id
        }
    }

    @PostMapping
    public ResponseEntity<Post> createPost(@RequestBody Post post) {
        log.info("Received request to create post: {}", post);
        Post createdPost = postService.createPost(post);
        return new ResponseEntity<>(createdPost, HttpStatus.CREATED);
    }

    @PatchMapping("/{postId}/hide")
    public ResponseEntity<Post> hidePost(@PathVariable String postId) {
        log.info("Received request to hide post: {}", postId);
        if(postService.hidePost(postId)) {
            return ResponseEntity.ok().build(); // 200 ok if post was updated
        } else {
            return ResponseEntity.notFound().build(); // 404 not found id
        }
    }

    @PatchMapping("/{postId}/unhide")
    public ResponseEntity<Post> unhidePost(@PathVariable String postId) {
        log.info("Received request to unhide post: {}", postId);
        if(postService.hidePost(postId)) {
            return ResponseEntity.ok().build(); // 200 ok if post was updated
        } else {
            return ResponseEntity.notFound().build(); // 404 not found id
        }
    }

    @PostMapping("/{postId}/favourite")
    public ResponseEntity<Post> favouritePost(@PathVariable String postId, @RequestBody String clientId) {
        boolean result = postService.favourite(postId, clientId);
        if(result) {
            return ResponseEntity.ok().build(); // 200 ok
        } else {
            return ResponseEntity.badRequest().build(); // already favoured
        }
    }

    @DeleteMapping("/{postId}/favourite")
    public ResponseEntity<Post> unfavouritePost(@PathVariable String postId, @RequestBody String clientId) {
        boolean result = postService.unfavourite(postId, clientId);
        if(result) {
            return ResponseEntity.ok().build(); // 200 ok
        } else {
            return ResponseEntity.badRequest().build(); // already unfavoured
        }
    }

    @GetMapping("/sell")
    public ResponseEntity<List<Post>> getVisiblePosts(@RequestParam String clientId) {
        log.info("Received request to get selling posts for client {}", clientId);
        List<Post> visiblePosts = postService.getSellPosts(clientId);
        return ResponseEntity.ok(visiblePosts);
    }

    @GetMapping("/sold")
    public ResponseEntity<List<Post>> getSoldPosts(@RequestParam String clientId) {
        log.info("Received request to get selling posts for client {}", clientId);
        List<Post> visiblePosts = postService.getSellPosts(clientId);
        return ResponseEntity.ok(visiblePosts);
    }

}