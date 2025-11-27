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

    private final PostEventProducer eventProducer;

    public PostService(PostRepository postRepository, FavouriteRepository favouriteRepository, PostEventProducer eventProducer) {
        this.postRepository = postRepository;
        this.favouriteRepository = favouriteRepository;
        this.eventProducer = eventProducer;
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
            log.error("No post found with id: {}", postId);
            throw new NoSuchElementException("Post not found with ID: " + postId);
        }

        if (post.getPostId() != null) {
            log.error("Illegal to update post_id");
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
        if (post.getCategory() != null && !post.getCategory().equals(existingPost.getCategory())) {
            existingPost.setCategory(post.getCategory());
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
        if (!Objects.equals(post.getHarvestDate(), existingPost.getHarvestDate())) {
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

    /**
     * Helper to check the content of a post
     * @param post a Post object
     * @return true if all fields were sent, false otherwise
     */
    boolean checkCreatePostContent(Post post) {
        if (post.getDescription() == null || post.getDescription().isEmpty()) return false;
        if (post.getPhotos() == null || post.getPhotos().isEmpty()) return false;
        if (post.getCategory() == null) return false;
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
     * Centralized method to change a post's status.
     * @param postId The ID of the post to modify.
     * @param requiredStatus The status the post MUST currently have to proceed (for validation).
     * @param targetStatus The new status to set on the post.
     * @param actionDescription A phrase describing the action (e.g., "banned", "hidden").
     */
    private void updatePostStatus(String postId, String requiredStatus, String targetStatus, String actionDescription) {
        Optional<Post> optionalPost = getPostById(postId);
        if (optionalPost.isEmpty()) {
            log.error("No post found with id: {}", postId);
            throw new NoSuchElementException("Post not found with ID: " + postId);
        }
        Post post = optionalPost.get();
        if (!post.getStatus().equals(requiredStatus)) {
            log.error("Post {} cannot be {} because its status is {}", postId, actionDescription, post.getStatus());
            throw new IllegalStateException("Post with id " + postId + " cannot be " + actionDescription + ", status is " + post.getStatus());
        }
        post.setStatus(targetStatus);
        post.setDateModified(new Date());
        postRepository.save(post);
        log.info("Post {} successfully {}", postId, actionDescription);
    }

    /**
     * Hide a post - change status to "hidden"
     * @param postId the id of the post
     * @return true if the post was successfully hidden, false otherwise
     */
    public boolean hidePost(String postId) {
        updatePostStatus(postId, "visible", "hidden", "hidden");
        return true;
    }

    /**
     * Unhide a post - change status to "visible"
     * @param postId the id of the post
     * @return true if the post was successfully unhidden, false otherwise
     */
    public boolean unhidePost(String postId) {
        updatePostStatus(postId, "hidden", "visible", "unhidden");
        return true;
    }

    private void validatePostAndFavoriteStatus(String postId, String clientId, boolean shouldExist, String action) {
        Optional<Post> post = getPostById(postId);
        if (post.isEmpty()) {
            log.error("Post not found with ID: {}", postId);
            throw new NoSuchElementException("Post not found with ID: " + postId);
        }

        boolean exists = favouriteRepository.existsByIdPostIdAndIdClientId(postId, clientId);
        if (shouldExist && !exists) {
            log.error("Post {} is NOT in favourite, cannot {}", postId, action);
            throw new IllegalStateException("Post with id " + postId + " is not favored, cannot " + action);
        }

        if (!shouldExist && exists) {
            log.error("Post {} is already IN favourite, cannot {}", postId, action);
            throw new IllegalStateException("Post with id " + postId + " is already favored, cannot " + action);
        }
    }

    /**
     * Favourite a post
     * @param postId the id of the post
     * @param clientId the id of the client favouring the post
     * @return true if the post was successfully favoured, false otherwise
     */
    public boolean favourite(String postId, String clientId) {
        validatePostAndFavoriteStatus(postId, clientId, false, "favourite");
        Favourite favourite = new Favourite();
        favourite.setId(new FavouriteId(postId, clientId));
        favourite.setDate(new Date());
        favouriteRepository.save(favourite);
        Optional<Post> post = getPostById(postId);
        if (post.isEmpty()) {
            log.error("Post not found with ID: {}", postId);
            throw new NoSuchElementException("Post not found with ID: " + postId);
        }
        eventProducer.sendPostEvent("POST_FAVOURITE", postId, clientId, post.get().getClientId());
        log.info("Put post favourite with ID: {} and client ID: {}", postId, clientId);
        return true;
    }

    /**
     * Unfavourite a post
     * @param postId the id of the post
     * @param clientId the id of the client unfavouring the post
     * @return true if the post was successfully unfavored, false otherwise
     */
    public boolean unfavourite(String postId, String clientId) {
        validatePostAndFavoriteStatus(postId, clientId, true, "unfavourite");
        Favourite favourite = new Favourite();
        favourite.setId(new FavouriteId(postId, clientId));
        favouriteRepository.delete(favourite);
        log.info("Removed post favourite with ID: {} and client ID: {}", postId, clientId);
        return true;
    }

    /**
     * Make the Post status "banned"
     * @param postId the id of the Post
     * @return true if the post was updated, false otherwise
     */
    public boolean banPost(String postId) {
        updatePostStatus(postId, "visible", "banned", "unbanned");
        return true;
    }

    /**
     * Make the Post status "banned"
     * @param postId the id of the Post
     * @return true if the post was updated, false otherwise
     */
    public boolean unbanPost(String postId) {
        updatePostStatus(postId, "banned", "visible", "banned");
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
     * @param buyerId the id of the buyer
     * @return an updated Post object
     */
    public Post buyPost(String postId, String buyerId) {
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

        // send notification for each client that had the post as favourite
        List<Favourite> listFavourite = getAllFavouritesForPost(postId);
        listFavourite.forEach(favourite -> {
            eventProducer.sendPostEvent("POST_FAVOURITE_SOLD", postId, post.get().getClientId(), favourite.getId().toString());
        });
        eventProducer.sendPostEvent("POST_BOUGHT", postId,post.get().getClientId(), buyerId);

        return postRepository.save(post.get());
    }

    /**
     * Helper to get all favourites for a post
     * @param postId the id of the post
     * @return a list of all favourites by post
     */
    private List<Favourite> getAllFavouritesForPost(String postId) {
        return favouriteRepository.findById_PostId(postId);
    }

    /**
     * Fetch all post by category
     * @param category the category
     * @return a list of Post
     */
    public List<Post> getPostByCategory(String category) {
        return postRepository.findByCategory(category);
    }

    public void deletePost(String postId) {
        Optional<Post> post = getPostById(postId);
        if (post.isEmpty()) {
            log.error("Post not found with ID: " + postId);
            throw new NoSuchElementException("Post not found with ID: " + postId);
        }
        postRepository.delete(post.get());
        log.info("Deleted post with ID: {} and client ID: {}", postId, post.get().getClientId());
    }
}