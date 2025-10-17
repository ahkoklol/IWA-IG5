package com.bondgraine.listingmicroservice;

import com.bondgraine.listingmicroservice.entity.Post;
import com.bondgraine.listingmicroservice.repository.FavouriteRepository;
import com.bondgraine.listingmicroservice.repository.PostRepository;
import com.bondgraine.listingmicroservice.service.PostService;
import jakarta.transaction.Transactional;
import org.junit.jupiter.api.Test;
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

    /**
     * Base post
     * @param clientId id of the client
     * @return a Post object
     */
    private Post createValidTestPost(String clientId) {
        Post post = new Post();
        post.setPost_id(clientId);
        post.setDescription("Test Post Description");
        post.setWeight(10.0);
        post.setQuantity(2);
        post.setPrice(15.99);
        post.setType("Fruit");
        post.setEdible(true);
        post.setStatus("visible");
        post.setClientId(clientId);
        post.setDate_created(new Date());
        return post;
    }

    /**
     * Helper method to set up posts with a specific status
     * @param clientId id of the client
     * @param status status of the post (hidden, visible, sold)
     * @param postIdSuffix
     * @return
     */
    private Post createPostWithStatus(String clientId, String status, String postIdSuffix) {
        Post post = new Post();
        post.setPost_id(clientId + "-" + postIdSuffix);
        post.setDescription(status + " Post");
        post.setWeight(1.0);
        post.setQuantity(1);
        post.setPrice(10.0);
        post.setType("Test");
        post.setEdible(true);
        post.setStatus(status); // Set the specific status
        post.setClientId(clientId);
        post.setDate_created(new Date());
        return postRepository.save(post); // Save directly via repository for setup
    }

    @Test
    void testCreatePost() {
        Post newPost = createValidTestPost("clientA");

        Post createdPost = postService.createPost(newPost);
        Optional<Post> fetchedPost = postService.getPostById(createdPost.getPost_id());

        assertThat(fetchedPost).isPresent();
        assertThat(fetchedPost.get().getClientId()).isEqualTo("clientA");
    }

    @Test
    void testUpdatePost() {
        Post savedPost = postRepository.save(createValidTestPost("clientB"));
        String postId = savedPost.getPost_id();

        Post updateData = new Post();
        updateData.setDescription("New Updated Description");
        updateData.setPrice(99.99); // Price change

        Post updatedPost = postService.updatePost(postId, updateData);

        assertThat(updatedPost).isNotNull();
        assertThat(updatedPost.getDescription()).isEqualTo("New Updated Description");
        assertThat(updatedPost.getPrice()).isEqualTo(99.99);
        assertThat(updatedPost.getDate_modified()).isAfter(updatedPost.getDate_created());
    }

    @Test
    void testHidePost() {
        Post savedPost = postRepository.save(createValidTestPost("clientC"));
        String postId = savedPost.getPost_id();

        boolean hidden = postService.hidePost(postId);
        Post postAfterHide = postService.getPostById(postId).orElseThrow();

        assertThat(hidden).isTrue();
        assertThat(postAfterHide.getStatus()).isEqualTo("hidden");
        assertThat(postAfterHide.getDate_modified()).isAfter(postAfterHide.getDate_created());
    }

    @Test
    void testUnhidePost() {
        Post savedPost = postRepository.save(createValidTestPost("clientC"));
        String postId = savedPost.getPost_id();

        boolean unhidden = postService.unhidePost(postId);
        Post postAfterUnhide = postService.getPostById(postId).orElseThrow();

        assertThat(unhidden).isTrue();
        assertThat(postAfterUnhide.getStatus()).isEqualTo("visible");
        assertThat(postAfterUnhide.getDate_modified()).isAfter(postAfterUnhide.getDate_created());
    }

    @Test
    void testFavourite_Successful() {
        Post savedPost = postRepository.save(createValidTestPost("owner1"));
        String postId = savedPost.getPost_id();
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
        Post savedPost = postRepository.save(createValidTestPost("owner2"));
        String postId = savedPost.getPost_id();
        String clientId = "fan3";

        postService.favourite(postId, clientId);
        boolean result = postService.favourite(postId, clientId); // Attempt to favourite again

        assertThat(result).isFalse();
        // Verify only one entry exists (not strictly necessary but confirms logic)
        assertThat(favouriteRepository.count()).isEqualTo(1);
    }

    @Test
    void testGetSellPosts_ReturnsOnlyVisiblePosts() {
        final String clientId = "client_visible_test";
        Post visiblePost = createPostWithStatus(clientId, "visible", "v1");
        Post anotherVisiblePost = createPostWithStatus(clientId, "visible", "v2");
        createPostWithStatus(clientId, "sold", "s1");
        Post hiddenPost = createPostWithStatus(clientId, "hidden", "h1");

        List<Post> sellPosts = postService.getSellPosts(clientId);

        // Should find exactly 2 posts with status "visible"
        assertThat(sellPosts).hasSize(2);

        // Ensure the list contains only the visible posts
        assertThat(sellPosts)
                .extracting(Post::getStatus)
                .containsOnly("visible");

        assertThat(sellPosts)
                .extracting(Post::getPost_id)
                .contains(visiblePost.getPost_id(), anotherVisiblePost.getPost_id())
                .doesNotContain(hiddenPost.getPost_id());
    }

    // ---------------------------------------------------------------------------------

    @Test
    void testGetSoldPosts_ReturnsOnlySoldPosts() {
        final String clientId = "client_sold_test";
        Post soldPost = createPostWithStatus(clientId, "sold", "s1");
        Post anotherSoldPost = createPostWithStatus(clientId, "sold", "s2");
        Post visiblePost = createPostWithStatus(clientId, "visible", "v1");
        createPostWithStatus(clientId, "hidden", "h1");
        List<Post> soldPosts = postService.getSoldPosts(clientId);

        // Should find exactly 2 posts with status "sold"
        assertThat(soldPosts).hasSize(2);

        // Ensure the list contains only the sold posts
        assertThat(soldPosts)
                .extracting(Post::getStatus)
                .containsOnly("sold");

        assertThat(soldPosts)
                .extracting(Post::getPost_id)
                .contains(soldPost.getPost_id(), anotherSoldPost.getPost_id())
                .doesNotContain(visiblePost.getPost_id());
    }
}
