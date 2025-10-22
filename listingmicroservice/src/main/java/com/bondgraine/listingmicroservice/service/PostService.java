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
            log.warn("No post found with id: {}", postId);
            return null;
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
        /*
        if (post.getPhotos() != null && !post.getPhotos().equals(existingPost.getPhotos())) {
            existingPost.setPhotos(post.getPhotos());
            updated = true;
        }*/
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
        post.setPostId(UUID.randomUUID().toString());
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
            post.setDateModified(new Date()); // Update modification timestamp
            postRepository.save(post);
            return true;
        }).orElse(false);
    }

    /**
     * Unhide a post - change status to "visible"
     * @param postId the id of the post
     * @return true if the post was successfully unhidden, false otherwise
     */
    public boolean unhidePost(String postId) {
        Optional<Post> optionalPost = getPostById(postId);
        return optionalPost.map(post -> {
            post.setStatus("visible");
            post.setDateModified(new Date()); // Update modification timestamp
            postRepository.save(post);
            return true;
        }).orElse(false);
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

    /**
     * Unfavourite a post
     * @param postId the id of the post
     * @param clientId the id of the client unfavouring the post
     * @return true if the post was successfully unfavored, false otherwise
     */
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
            throw new NoSuchElementException("Post not found with ID: " + postId);
        }
        if (!post.get().getStatus().equals("visible")) {
            throw new IllegalStateException("Post with ID: " + postId + " cannot be purchased. Current status is: " + post.get().getStatus());
        }
        post.get().setStatus("sold");
        log.info("Post with id {} marked as sold", postId);
        return postRepository.save(post.get());
    }
}