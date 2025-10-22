package com.bondgraine.listingmicroservice;

import com.bondgraine.listingmicroservice.entity.Post;
import com.bondgraine.listingmicroservice.repository.FavouriteRepository;
import com.bondgraine.listingmicroservice.repository.PostRepository;
import com.bondgraine.listingmicroservice.service.PostService;
import jakarta.transaction.Transactional;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.BeforeEach;
import org.springframework.beans.factory.annotation.Autowired;

import java.util.Date;
import java.util.List;
import java.util.NoSuchElementException;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertThrows;

@Transactional
public class PostServiceTest extends PostgresTestcontainer {

    @Autowired
    private PostService postService;

    @Autowired
    private PostRepository postRepository;

    @Autowired
    private FavouriteRepository favouriteRepository;

    private Post defaultPost;
    private Post hiddenPost;
    private Post soldPost;
    private String defaultPostId;
    private String hiddenPostId;
    private String soldPostId;
    private final String defaultClientId = "TEST_CLIENT_ID";

    // Add this helper method to your PostServiceTest class
    private Post createBasePost(String postId, String status) {
        Post post = new Post();
        post.setPostId(postId);
        post.setDescription("Default Test Post Description");
        post.setWeight(10.0);
        post.setQuantity(2);
        post.setPrice(15.99);
        post.setType("Fruit");
        post.setEdible(true);
        post.setStatus(status); // Set the specific status
        post.setClientId(defaultClientId);
        post.setDateCreated(new Date());
        return post;
    }

    @BeforeEach
    void setUp() {
        // 1. VISIBLE Post
        Post visiblePost = createBasePost("PST-VIS-123", "visible");
        this.defaultPost = postRepository.save(visiblePost);
        this.defaultPostId = this.defaultPost.getPostId();

        // 2. HIDDEN Post
        Post hiddenPostInstance = createBasePost("PST-HID-456", "hidden");
        this.hiddenPost = postRepository.save(hiddenPostInstance);
        this.hiddenPostId = this.hiddenPost.getPostId();

        // 3. SOLD Post
        Post soldPostInstance = createBasePost("PST-SOLD-789", "sold");
        this.soldPost = postRepository.save(soldPostInstance);
        this.soldPostId = this.soldPost.getPostId();
    }

    @Test
    void testCreatePost() {
        Post newPost = new Post();
        newPost.setPostId("createPostId");
        newPost.setDescription("description");
        newPost.setWeight(1.0);
        newPost.setQuantity(1);
        newPost.setPrice(10.0);
        newPost.setType("Test");
        newPost.setEdible(true);
        newPost.setStatus("visible"); // Set the specific status
        newPost.setClientId(defaultClientId);
        newPost.setDateCreated(new Date());

        Post createdPost = postService.createPost(newPost);
        Optional<Post> fetchedPost = postService.getPostById(createdPost.getPostId());

        assertThat(fetchedPost).isPresent();
        assertThat(fetchedPost.get().getClientId()).isEqualTo(defaultClientId);
    }

    @Test
    void testGetPostById_Found() {
        Optional<Post> fetchedPost = postService.getPostById(defaultPostId);

        assertThat(fetchedPost).isPresent();
        assertThat(fetchedPost.get().getClientId()).isEqualTo(defaultClientId);
        assertThat(fetchedPost.get().getDescription()).isEqualTo("Default Test Post Description");
    }

    @Test
    void testUpdatePost_Successful() {
        Post updateData = new Post();
        updateData.setDescription("New Updated Description");
        updateData.setPrice(99.99);

        Post updatedPost = postService.updatePost(defaultPostId, updateData);

        assertThat(updatedPost).isNotNull();
        assertThat(updatedPost.getDescription()).isEqualTo("New Updated Description");
        assertThat(updatedPost.getPrice()).isEqualTo(99.99);
    }

    @Test
    void testHidePost_ChangesStatus() {
        boolean hidden = postService.hidePost(defaultPostId);
        Post postAfterHide = postService.getPostById(defaultPostId).orElseThrow();

        assertThat(hidden).isTrue();
        assertThat(postAfterHide.getStatus()).isEqualTo("hidden");
    }

    @Test
    void testFavourite_Successful() {
        String postId = defaultPostId;
        String clientId = "fan1";

        boolean result = postService.favourite(postId, clientId);

        assertThat(result).isTrue();
        assertThat(favouriteRepository.existsByIdPostIdAndIdClientId(postId, clientId)).isTrue();
    }

    @Test
    void testFavourite_PostNotFound_ThrowsException() {
        String nonExistentPostId = "non-existent-id";
        String clientId = "fan2";

        assertThrows(NoSuchElementException.class, () -> {
            postService.favourite(nonExistentPostId, clientId);
        });
    }

    @Test
    void testFavourite_AlreadyExists_ReturnsFalse() {
        String postId = defaultPostId;
        String clientId = "fan3";

        postService.favourite(postId, clientId);
        boolean result = postService.favourite(postId, clientId); // Attempt to favourite again

        assertThat(result).isFalse();
        // Verify only one entry exists (not strictly necessary but confirms logic)
        assertThat(favouriteRepository.count()).isEqualTo(1);
    }

    @Test
    void testGetSellPosts_ReturnsOnlyVisiblePosts() {

        List<Post> sellPosts = postService.getSellPosts(defaultClientId);

        // Should find exactly 2 posts with status "visible"
        assertThat(sellPosts).hasSize(1);

        // Ensure the list contains only the visible posts
        assertThat(sellPosts)
                .extracting(Post::getStatus)
                .containsOnly("visible");

        assertThat(sellPosts)
                .extracting(Post::getPostId)
                .contains(defaultPostId)
                .doesNotContain(hiddenPost.getPostId());
    }

    @Test
    void testGetSoldPosts_ReturnsOnlySoldPosts() {
        // Act: Call service with the correct Client ID
        List<Post> soldPosts = postService.getSoldPosts(defaultClientId);

        // Assert 1: Only ONE sold post was created for this client in setUp()
        assertThat(soldPosts).hasSize(1);

        // Assert 2: The post returned must be the specific sold post ID
        assertThat(soldPosts)
                .extracting(Post::getPostId)
                .containsOnly(soldPostId); // Use containsOnly for precision
    }

    @Test
    void testBuyPost_Successful_MarksAsSold() {
        Post updatedPost = postService.buyPost(defaultPostId);

        assertThat(updatedPost).isNotNull();
        assertThat(updatedPost.getStatus()).isEqualTo("sold");
        assertThat(postRepository.findById(defaultPostId).get().getStatus()).isEqualTo("sold");
    }

    @Test
    void testBuyPost_PostNotFound_ThrowsNoSuchElementException() {
        String nonExistentPostId = "non-existent-buy-id";

        // Expect a NoSuchElementException to be thrown when calling buyPost with a bad ID
        assertThrows(NoSuchElementException.class, () -> {
            postService.buyPost(nonExistentPostId);
        });
    }

    @Test
    void testBuyPost_AlreadySold_ThrowsIllegalStateException() {
        String postId = soldPostId;

        // The service should throw IllegalStateException because 'sold' is neither 'visible' nor 'hidden'
        IllegalStateException exception = assertThrows(IllegalStateException.class, () -> {
            postService.buyPost(postId);
        });

        // Verify the exception message is descriptive
        assertThat(exception.getMessage())
                .contains("cannot be purchased")
                .contains("Current status is: sold");
    }

    @Test
    void testBuyPost_Hidden_ThrowsIllegalStateException() {
        // Arrange: Use the post set to "hidden" in @BeforeEach
        String postId = hiddenPostId;

        // Act & Assert: Expect an exception
        IllegalStateException exception = assertThrows(IllegalStateException.class, () -> {
            postService.buyPost(postId);
        });

        // Verify the exception message is descriptive
        assertThat(exception.getMessage())
                .contains("cannot be purchased")
                .contains("Current status is: hidden");
    }
}
