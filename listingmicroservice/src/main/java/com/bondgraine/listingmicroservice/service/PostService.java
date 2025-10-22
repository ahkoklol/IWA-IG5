package com.bondgraine.listingmicroservice.service;

import com.bondgraine.listingmicroservice.entity.Favourite;
import com.bondgraine.listingmicroservice.entity.FavouriteId;
import com.bondgraine.listingmicroservice.entity.Post;
import com.bondgraine.listingmicroservice.repository.FavouriteRepository;
import com.bondgraine.listingmicroservice.repository.PostRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
public class PostService {

    private static final Logger log = LoggerFactory.getLogger(PostService.class);

    private final PostRepository postRepository;

    private final FavouriteRepository favouriteRepository;

    public PostService(PostRepository postRepository, FavouriteRepository favouriteRepository) {
        this.postRepository = postRepository;
        this.favouriteRepository = favouriteRepository;
    }

    /**
     * Fetch a post by id
     * @param postId the id of the post
     * @return a Post object
     */
    public Optional<Post> getPostById(String postId) {
        return postRepository.findById(postId);
    }

    /**
     * Update a post by id -> for now updates all fields
     * TODO: do we need a DTO for Patch because we only update specific fields?
     * @param postId the id of the post
     * @param post the Post object with updated info
     * @return the updated Post object
     */
    public Post updatePost(String postId, Post post) {

        Post existingPost = postRepository.findById(postId)
                .orElse(null);

        if (existingPost == null) {
            log.warn("No post found with id: {}", postId);
            throw new NoSuchElementException("Post not found with ID: " + postId);
        }

        if (post.getPostId() != null) {
            log.warn("Illegal to update post_id");
            throw new IllegalArgumentException("Post ID cannot be modified during an update operation.");
        }

        // Set service-managed fields only if a change occurred
        if (applyUpdates(existingPost, post)) {
            existingPost.setDateModified(new Date());
            log.info("Updated post: {}", existingPost);
            return postRepository.save(existingPost);
        }

        // If nothing changed, return the existing entity without saving
        log.warn("Nothing had to be updated: {}", existingPost);
        return existingPost;
    }

    /**
     * Helper method to compare Post fields and apply updates
     * @param existingPost the post from the database
     * @param post the data of the post to update
     * @return true if a field was updated, false otherwise
     */
    boolean applyUpdates(Post existingPost, Post post) {
        boolean updated = false;

        if (post.getDescription() != null && !post.getDescription().equals(existingPost.getDescription())) {
            existingPost.setDescription(post.getDescription());
            updated = true;
        }
        if (post.getPhotos() != null && !post.getPhotos().equals(existingPost.getPhotos())) {
            existingPost.setPhotos(post.getPhotos());
            updated = true;
        }
        if (post.getWeight() != existingPost.getWeight()) {
            existingPost.setWeight(post.getWeight());
            updated = true;
        }
        if (post.getQuantity() != existingPost.getQuantity()) {
            existingPost.setQuantity(post.getQuantity());
            updated = true;
        }
        if (post.getType() != null && !post.getType().equals(existingPost.getType())) {
            existingPost.setType(post.getType());
            updated = true;
        }
        if (post.getPrice() != existingPost.getPrice()) {
            existingPost.setPrice(post.getPrice());
            updated = true;
        }
        if (!Objects.equals(post.getSeason(), existingPost.getSeason())) {
            existingPost.setSeason(post.getSeason());
            updated = true;
        }
        if (!Objects.equals(post.getFloweringSeason(), existingPost.getFloweringSeason())) {
            existingPost.setFloweringSeason(post.getFloweringSeason());
            updated = true;
        }
        if (post.getHarvestDate() != existingPost.getHarvestDate()) {
            existingPost.setHarvestDate(post.getHarvestDate());
            updated = true;
        }
        if (post.isEdible() != existingPost.isEdible()) {
            existingPost.setEdible(post.isEdible());
            updated = true;
        }
        return updated;
    }

    /**
     * Create a post
     * @param post the Post object to create
     * @return the created Post object
     */
    public Post createPost(Post post) {
        if (!checkCreatePostContent(post)) {
            throw new IllegalArgumentException("Some fields are missing");
        }
        post.setPostId(UUID.randomUUID().toString());
        Date now = new Date();
        post.setDateCreated(now);
        post.setDateModified(now);
        post.setStatus("visible");
        return postRepository.save(post);
    }

    boolean checkCreatePostContent(Post post) {
        if (post.getDescription() == null || post.getDescription().isEmpty()) return false;
        if (post.getPhotos() == null || post.getPhotos().isEmpty()) return false;
        if (post.getType() == null || post.getType().isEmpty()) return false;
        if (post.getSeason() == null || post.getSeason().isEmpty()) return false;
        if (post.getFloweringSeason() == null || post.getFloweringSeason().isEmpty()) return false;
        if (post.getHarvestDate() == null) return false;
        if (post.getClientId() == null || post.getClientId().isEmpty()) return false;
        if (post.getWeight() <= 0.0) return false;
        if (post.getPrice() <= 0.0) return false;
        if (post.getQuantity() <= 0) return false;
        return true;
    }

    /**
     * Hide a post - change status to "hidden"
     * @param postId the id of the post
     * @return true if the post was successfully hidden, false otherwise
     */
    public boolean hidePost(String postId) {
        Optional<Post> optionalPost = getPostById(postId);
        if (optionalPost.isEmpty()) {
            log.error("No post found with id: {}", postId);
            throw new NoSuchElementException("Post not found with ID: " + postId);
        }
        Post post = optionalPost.get();
        if (!post.getStatus().equals("visible")) {
            log.error("Post {} is already hidden or sold", postId);
            throw new IllegalStateException("Post with id " + postId + "cannot be hidden, status is {}" + post.getStatus());
        }
        post.setStatus("hidden");
        post.setDateModified(new Date());
        postRepository.save(post);
        log.info("Post {} successfully hidden", postId);
        return true;
    }

    /**
     * Unhide a post - change status to "visible"
     * @param postId the id of the post
     * @return true if the post was successfully unhidden, false otherwise
     */
    public boolean unhidePost(String postId) {
        Optional<Post> optionalPost = getPostById(postId);
        if (optionalPost.isEmpty()) {
            log.error("No post found with id: {}", postId);
            throw new NoSuchElementException("Post not found with ID: " + postId);
        }
        Post post = optionalPost.get();
        if (!post.getStatus().equals("hidden")) {
            log.error("Post {} is already visible or sold", postId);
            throw new IllegalStateException("Post with id " + postId + "cannot be unhidden, status is {}" + post.getStatus());
        }
        post.setStatus("visible");
        post.setDateModified(new Date());
        postRepository.save(post);
        log.info("Post {} successfully unhidden", postId);
        return true;
    }

    /**
     * Favourite a post
     * @param postId the id of the post
     * @param clientId the id of the client favouring the post
     * @return true if the post was successfully favoured, false otherwise
     */
    public boolean favourite(String postId, String clientId) {
        Optional<Post> post = getPostById(postId);
        if (post.isEmpty()) {
            log.error("Post not found with ID: " + postId);
            throw new NoSuchElementException("Post not found with ID: " + postId);
        }
        boolean exists = favouriteRepository.existsByIdPostIdAndIdClientId(postId, clientId);
        if (exists) {
            log.error("Post {} is already in favourite", postId);
            throw new IllegalStateException("Post with id " + postId + "cannot be favored, status is {}" + post.get().getStatus());

        }
        Favourite favourite = new Favourite();
        favourite.setId(new FavouriteId(postId, clientId));
        favourite.setDate(new Date());
        favouriteRepository.save(favourite);
        log.info("Put post favourite with ID: " + postId + "and client ID: " + clientId);
        return true;
    }

    /**
     * Unfavourite a post
     * @param postId the id of the post
     * @param clientId the id of the client unfavouring the post
     * @return true if the post was successfully unfavored, false otherwise
     */
    public boolean unfavourite(String postId, String clientId) {
        Optional<Post> post = getPostById(postId);
        if (post.isEmpty()) {
            log.error("Post not found with ID: " + postId);
            throw new NoSuchElementException("Post not found with ID: " + postId);
        }
        boolean exists = favouriteRepository.existsByIdPostIdAndIdClientId(postId, clientId);
        if (!exists) {
            log.error("Post {} is not in favourite", postId);
            throw new IllegalStateException("Post with id " + postId + "cannot be unfavored, status is {}" + post.get().getStatus());
        }
        Favourite favourite = new Favourite();
        favourite.setId(new FavouriteId(postId, clientId));
        favouriteRepository.delete(favourite);
        log.info("Removed post favourite with ID: " + postId + " and client ID: " + clientId);
        return true;
    }

    /**
     * Fetch the list of all posts with status 'visible'
     * @param clientId the id of the seller
     * @return a list of Post
     */
    public List<Post> getSellPosts(String clientId) {
        List<Post> list = postRepository.findByClientIdAndStatus(clientId, "visible");
        log.info("Found {} posts with status 'visible' for client {}", list.size(), clientId);
        return list;
    }

    /**
     * Fetch the list of all posts with status 'sold'
     * @param clientId the id of the seller
     * @return a list of Post
     */
    public List<Post> getSoldPosts(String clientId) {
        List<Post> list = postRepository.findByClientIdAndStatus(clientId, "sold");
        log.info("Found {} posts with status 'sold'  for client {}", list.size(), clientId);
        return list;
    }

    /**
     * Mark the Post as sold
     * @param postId the id of the post
     * @return an updated Post object
     */
    public Post buyPost(String postId) {
        Optional<Post> post = getPostById(postId);
        if (post.isEmpty()) {
            log.error("Post not found with ID: " + postId);
            throw new NoSuchElementException("Post not found with ID: " + postId);
        }
        if (!post.get().getStatus().equals("visible")) {
            log.error("Post {} is not visible", postId);
            throw new IllegalStateException("Post with ID: " + postId + " cannot be purchased. Current status is: " + post.get().getStatus());
        }
        post.get().setStatus("sold");
        log.info("Post with id {} marked as sold", postId);
        return postRepository.save(post.get());
    }
}