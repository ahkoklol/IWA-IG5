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
                // If not found, return null as per your constraint
                .orElse(null);

        if (existingPost == null) {
            return null;
        }

        // Set service-managed fields only if a change occurred
        if (applyUpdates(existingPost, post)) {
            existingPost.setDate_modified(new Date());
            return postRepository.save(existingPost);
        }

        // If nothing changed, return the existing entity without saving
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
        if (!Objects.equals(post.getFlowering_season(), existingPost.getFlowering_season())) {
            existingPost.setFlowering_season(post.getFlowering_season());
            updated = true;
        }
        if (post.getHarvest_date() != existingPost.getHarvest_date()) {
            existingPost.setHarvest_date(post.getHarvest_date());
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
            post.setStatus("hidden");
            post.setDate_modified(new Date()); // Update modification timestamp
            postRepository.save(post);
            return true;
        }).orElse(false);
    }

    /**
     * Hide a post - change status to "hidden"
     * @param postId the id of the post
     * @return true if the post was successfully hidden, false otherwise
     */
    public boolean unhidePost(String postId) {
        Optional<Post> optionalPost = getPostById(postId);
        return optionalPost.map(post -> {
            post.setStatus("visible");
            post.setDate_modified(new Date()); // Update modification timestamp
            postRepository.save(post);
            return true;
        }).orElse(false);
    }

    public boolean favourite(String postId, String clientId) {
        Optional<Post> post = getPostById(postId);
        if (post.isEmpty()) {
            throw new NoSuchElementException("Post not found with ID: " + postId);
        }

        boolean exists = favouriteRepository.existsByIdPostIdAndIdClientId(postId, clientId);
        if (exists) {
            return false;
        }
        Favourite favourite = new Favourite();
        favourite.setId(new FavouriteId(postId, clientId));
        favourite.setDate(new Date());
        favouriteRepository.save(favourite);
        log.info("Put post favourite with ID: " + postId + "and client ID: " + clientId);
        return true;
    }

    public boolean unfavourite(String postId, String clientId) {
        Optional<Post> post = getPostById(postId);
        if (post.isEmpty()) {
            throw new NoSuchElementException("Post not found with ID: " + postId);
        }

        boolean exists = favouriteRepository.existsByIdPostIdAndIdClientId(postId, clientId);
        if (!exists) {
            return false;
        }
        Favourite favourite = new Favourite();
        favourite.setId(new FavouriteId(postId, clientId));
        favouriteRepository.delete(favourite);
        log.info("Removed post favourite with ID: " + postId + " and client ID: " + clientId);
        return true;
    }

    public List<Post> getSellPosts(String clientId) {
        List<Post> list = postRepository.findByClientIdAndStatus(clientId, "visible");
        log.info("Found {} posts with status 'visible' for client {}", list.size(), clientId);
        return list;
    }

    public List<Post> getSoldPosts(String clientId) {
        List<Post> list = postRepository.findByClientIdAndStatus(clientId, "sold");
        log.info("Found {} posts with status 'sold'  for client {}", list.size(), clientId);
        return list;
    }
}