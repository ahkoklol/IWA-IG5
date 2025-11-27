package com.bondgraine.listingmicroservice;

import com.bondgraine.listingmicroservice.entity.Category;
import com.bondgraine.listingmicroservice.entity.Post;
import com.bondgraine.listingmicroservice.repository.CategoryRepository;
import com.bondgraine.listingmicroservice.repository.FavouriteRepository;
import com.bondgraine.listingmicroservice.repository.PostRepository;
import com.bondgraine.listingmicroservice.service.PostService;
import jakarta.transaction.Transactional;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;

import java.util.*;

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
    @Autowired
    private CategoryRepository categoryRepository;

    private Category createBaseCategory(String categoryId, String name) {
        Category category = new Category();
        category.setCategoryId(categoryId);
        category.setName(name);
        categoryRepository.save(category);
        return category;
    }

    private Post createBasePost(String postId, String status, String category) {
        Post post = new Post();
        post.setPostId(postId);
        post.setDescription("Default Test Post Description");
        post.setWeight(10.0);
        post.setQuantity(2);
        post.setPrice(15.99);
        post.setCategory(category);
        post.setEdible(true);
        post.setStatus(status); // Set the specific status
        post.setClientId(defaultClientId);
        post.setDateCreated(new Date());
        return post;
    }

    @BeforeEach
    void setUp() {
        createBaseCategory("vegetables", "Vegetables");
        createBaseCategory("fruits", "Fruits");
        createBaseCategory("aromatic_herbs_spices", "Aromatic herbs / Spices");
        createBaseCategory("medicinal_plants", "Medicinal plants");
        createBaseCategory("decorative_flowers", "Decorative flowers");
        createBaseCategory("exotic_rare_plants", "Exotic rare plants");

        // 1. VISIBLE Post
        Post visiblePost = createBasePost("PST-VIS-123", "visible", "Fruits");
        this.defaultPost = postRepository.save(visiblePost);
        this.defaultPostId = this.defaultPost.getPostId();

        // 2. HIDDEN Post
        Post hiddenPostInstance = createBasePost("PST-HID-456", "hidden", "Vegetables");
        this.hiddenPost = postRepository.save(hiddenPostInstance);
        this.hiddenPostId = this.hiddenPost.getPostId();

        // 3. SOLD Post
        Post soldPostInstance = createBasePost("PST-SOLD-789", "sold", "Fruits");
        this.soldPost = postRepository.save(soldPostInstance);
        this.soldPostId = this.soldPost.getPostId();
    }

    @Test
    void testCreatePost_AllFieldsValid() {
        Post newPost = new Post();
        newPost.setDescription("description");
        newPost.setPhotos(new ArrayList<>()); // Initialize if null
        newPost.getPhotos().add("photo1");
        newPost.setSeason("season");
        newPost.setFloweringSeason("floweringSeason");
        newPost.setHarvestDate("January - March 2026");
        newPost.setWeight(1.0);
        newPost.setQuantity(1);
        newPost.setPrice(10.0);
        newPost.setCategory("Fruits");
        newPost.setEdible(true);
        newPost.setClientId(defaultClientId);

        Post createdPost = postService.createPost(newPost);
        Optional<Post> fetchedPost = postService.getPostById(createdPost.getPostId());

        assertThat(fetchedPost).isPresent();
        assertThat(fetchedPost.get().getStatus()).isEqualTo("visible");
        assertThat(fetchedPost.get().getDateCreated()).isEqualTo(fetchedPost.get().getDateModified());
        assertThat(fetchedPost.get().getClientId()).isEqualTo(defaultClientId);
    }

    @Test
    void testCreatePost_FieldsMissing_ThrowsIllegalArgumentException() {
        Post newPost = new Post();
        newPost.setDescription("description");
        assertThrows(
                IllegalArgumentException.class,
                () -> postService.createPost(newPost)
        );
    }

    @Test
    void testGetPostById_Found() {
        Optional<Post> fetchedPost = postService.getPostById(defaultPostId);

        assertThat(fetchedPost).isPresent();
        assertThat(fetchedPost.get().getClientId()).isEqualTo(defaultClientId);
        assertThat(fetchedPost.get().getDescription()).isEqualTo("Default Test Post Description");
    }

    @Test
    void testUpdatePost_PostNotFound_ThrowsNoSuchElementException() {
        Post update = new Post();
        update.setPrice(99.99);
        assertThrows(
                NoSuchElementException.class,
                () -> postService.updatePost("fakeid", update)
        );
    }

    @Test
    void testUpdatePost_Successful() {
        Post updateData = new Post();
        updateData.setDescription("New Updated Description");
        updateData.setPrice(99.99);

        Post updatedPost = postService.updatePost(defaultPostId, updateData);

        assertThat(updatedPost).isNotNull();
        assertThat(updatedPost.getDateCreated() != updatedPost.getDateModified()).isTrue();
        assertThat(updatedPost.getDescription()).isEqualTo("New Updated Description");
        assertThat(updatedPost.getPrice()).isEqualTo(99.99);
    }

    @Test
    void testHidePost_ChangesStatus() {
        boolean hidden = postService.hidePost(defaultPostId);
        Post postAfterHide = postService.getPostById(defaultPostId).orElseThrow();

        assertThat(hidden).isTrue();
        assertThat(postAfterHide.getStatus()).isEqualTo("hidden");
        assertThat(postAfterHide.getDateModified() != postAfterHide.getDateCreated()).isTrue();
    }

    @Test
    void testHidePost_PostNotFound_ThrowsNoSuchElementException() {
        assertThrows(
                NoSuchElementException.class,
                () -> postService.hidePost("fakeid")
        );
    }

    @Test
    void testHidePost_WrongStatus_ThrowsIllegalStateException() {
        postService.hidePost(defaultPostId);
        assertThrows(
                IllegalStateException.class,
                () -> postService.hidePost(defaultPostId)
        );
    }

    @Test
    void testUnhidePost_ChangesStatus() {
        postService.hidePost(defaultPostId);
        boolean unhidden = postService.unhidePost(defaultPostId);
        Post postAfterHide = postService.getPostById(defaultPostId).orElseThrow();

        assertThat(unhidden).isTrue();
        assertThat(postAfterHide.getStatus()).isEqualTo("visible");
        assertThat(postAfterHide.getDateModified() != postAfterHide.getDateCreated()).isTrue();
    }

    @Test
    void testUnhidePost_PostNotFound_ThrowsNoSuchElementException() {
        postService.hidePost(defaultPostId);
        assertThrows(
                NoSuchElementException.class,
                () -> postService.unhidePost("fakeid")
        );
    }

    @Test
    void testUnhidePost_WrongStatus_ThrowsIllegalStateException() {
        assertThrows(
                IllegalStateException.class,
                () -> postService.unhidePost(defaultPostId)
        );
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
    void testFavourite_PostNotFound_ThrowsNoSuchElementException() {
        String nonExistentPostId = "non-existent-id";
        String clientId = "fan2";

        assertThrows(NoSuchElementException.class, () -> {
            postService.favourite(nonExistentPostId, clientId);
        });
    }

    @Test
    void testFavourite_AlreadyExists_ThrowsIllegalStateException() {
        String postId = defaultPostId;
        String clientId = "fan3";

        postService.favourite(postId, clientId);

        assertThrows(IllegalStateException.class, () -> {
            postService.favourite(postId, clientId); // Attempt to favourite again
        });
    }

    @Test
    void testUnfavourite_Successful() {
        String postId = defaultPostId;
        String clientId = "fan1";

        postService.favourite(postId, clientId);
        boolean result = postService.unfavourite(postId, clientId);

        assertThat(result).isTrue();
        assertThat(favouriteRepository.existsByIdPostIdAndIdClientId(postId, clientId)).isFalse();
    }

    @Test
    void testUnfavourite_PostNotFound_ThrowsNoSuchElementException() {
        String nonExistentPostId = "non-existent-id";
        String clientId = "fan2";

        assertThrows(NoSuchElementException.class, () -> {
            postService.unfavourite(nonExistentPostId, clientId);
        });
    }

    @Test
    void testUnfavourite_PostNotInFavourite_ThrowsIllegalStateException() {
        String postId = defaultPostId;
        String clientId = "fan3";

        assertThrows(IllegalStateException.class, () -> {
            postService.unfavourite(postId, clientId);
        });
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
        Post updatedPost = postService.buyPost(defaultPostId, "testclientid");

        assertThat(updatedPost).isNotNull();
        assertThat(updatedPost.getStatus()).isEqualTo("sold");
        assertThat(postRepository.findById(defaultPostId).get().getStatus()).isEqualTo("sold");
    }

    @Test
    void testBuyPost_PostNotFound_ThrowsNoSuchElementException() {
        String nonExistentPostId = "non-existent-buy-id";

        // Expect a NoSuchElementException to be thrown when calling buyPost with a bad ID
        assertThrows(NoSuchElementException.class, () -> {
            postService.buyPost(nonExistentPostId, "testclientid");
        });
    }

    @Test
    void testBuyPost_AlreadySold_ThrowsIllegalStateException() {
        String postId = soldPostId;

        // The service should throw IllegalStateException because 'sold' is neither 'visible' nor 'hidden'
        IllegalStateException exception = assertThrows(IllegalStateException.class, () -> {
            postService.buyPost(postId, "testclientid");
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
            postService.buyPost(postId, "testclientid");
        });

        // Verify the exception message is descriptive
        assertThat(exception.getMessage())
                .contains("cannot be purchased")
                .contains("Current status is: hidden");
    }

    @Test
    void testGetPostByCategory() {
        List<Post> posts = postService.getPostByCategory("Fruits");

        assertThat(posts).isNotEmpty();
        assertThat(posts).hasSize(2);
        assertThat(posts.getFirst().getCategory()).isEqualTo("Fruits");
    }
}
