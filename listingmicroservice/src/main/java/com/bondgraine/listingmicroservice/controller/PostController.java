package com.bondgraine.listingmicroservice.controller;

import com.bondgraine.listingmicroservice.entity.Category;
import com.bondgraine.listingmicroservice.entity.Post;
import com.bondgraine.listingmicroservice.service.CategoryService;
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

    private final CategoryService categoryService;

    public PostController(PostService postService,  CategoryService categoryService) {
        this.postService = postService;
        this.categoryService = categoryService;
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

        if (updatedPost == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(updatedPost);
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
        if (!postService.hidePost(postId)) {
            return ResponseEntity.notFound().build(); // 404 not found id
        }
        return ResponseEntity.ok().build(); // 200 ok if post was updated
    }

    @PatchMapping("/{postId}/unhide")
    public ResponseEntity<Post> unhidePost(@PathVariable String postId) {
        log.info("Received request to unhide post: {}", postId);
        if (!postService.unhidePost(postId)) {
            return ResponseEntity.notFound().build(); // 404 not found id
        }
        return ResponseEntity.ok().build(); // 200 ok if post was updated
    }

    @PatchMapping("/{postId}/ban")
    public ResponseEntity<Post> banPost(@PathVariable String postId) {
        log.info("Received request to ban post: {}", postId);
        if (!postService.banPost(postId)) {
            return ResponseEntity.notFound().build(); // 404 not found id
        }
        return ResponseEntity.ok().build(); // 200 ok if post was updated
    }

    @PatchMapping("/{postId}/unban")
    public ResponseEntity<Post> unbanPost(@PathVariable String postId) {
        log.info("Received request to unban post: {}", postId);
        if (!postService.unbanPost(postId)) {
            return ResponseEntity.notFound().build(); // 404 not found id
        }
        return ResponseEntity.ok().build(); // 200 ok if post was updated
    }

    @PostMapping("/{postId}/favourite")
    public ResponseEntity<Post> favouritePost(@PathVariable String postId, @RequestBody String clientId) {
        boolean result = postService.favourite(postId, clientId);
        if (!result) {
            return ResponseEntity.notFound().build(); // 404 not found id
        }
        return ResponseEntity.ok().build(); // 200 ok
    }

    @DeleteMapping("/{postId}/favourite")
    public ResponseEntity<Post> unfavouritePost(@PathVariable String postId, @RequestBody String clientId) {
        boolean result = postService.unfavourite(postId, clientId);
        if (!result) {
            return ResponseEntity.notFound().build(); // 404 not found id
        }
        return ResponseEntity.ok().build(); // 200 ok
    }

    @GetMapping("/{clientId}/sellList")
    public ResponseEntity<List<Post>> getVisiblePosts(@PathVariable String clientId) {
        log.info("Received request to get selling posts for client {}", clientId);
        List<Post> visiblePosts = postService.getSellPosts(clientId);
        return ResponseEntity.ok(visiblePosts);
    }

    @GetMapping("/{clientId}/soldList")
    public ResponseEntity<List<Post>> getSoldPosts(@PathVariable String clientId) {
        log.info("Received request to get sold posts for client {}", clientId);
        List<Post> visiblePosts = postService.getSoldPosts(clientId);
        return ResponseEntity.ok(visiblePosts);
    }

    @PatchMapping("/{postId}/buy")
    public ResponseEntity<Post> buyPost(@PathVariable String postId, @RequestParam String buyerId) {
        log.info("Received request to buy post: {}", postId);
        Post post = postService.buyPost(postId, buyerId);
        if (post == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(post);
    }

    @GetMapping("/category")
    public ResponseEntity<List<Category>> getCategories() {
        log.info("Received request to get categories");
        List<Category> categories = categoryService.getCategories();
        return ResponseEntity.ok(categories);
    }

    @GetMapping("/category/{category}")
    public ResponseEntity<List<Post>> getPostByCategory(@PathVariable String category) {
        log.info("Received request to get post by category {}", category);
        List<Post> posts = postService.getPostByCategory(category);
        return ResponseEntity.ok(posts);
    }

    @DeleteMapping("/{postId}")
    public ResponseEntity<Void>  deletePost(@PathVariable String postId) {
        postService.deletePost(postId);
        return ResponseEntity.ok().build();
    }
}