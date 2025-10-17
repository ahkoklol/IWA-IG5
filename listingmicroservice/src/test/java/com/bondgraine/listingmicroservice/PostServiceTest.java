package com.bondgraine.listingmicroservice;

import com.bondgraine.listingmicroservice.entity.Post;
import com.bondgraine.listingmicroservice.repository.FavouriteRepository;
import com.bondgraine.listingmicroservice.repository.PostRepository;
import com.bondgraine.listingmicroservice.service.PostService;
import jakarta.transaction.Transactional;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;

import java.util.Date;
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
        post.setClient_id(clientId);
        post.setDate_created(new Date());
        return post;
    }

    @Test
    void testCreatePostAndGetPostById() {
        // Arrange
        Post newPost = createValidTestPost("clientA");

        // Act
        Post createdPost = postService.createPost(newPost);
        Optional<Post> fetchedPost = postService.getPostById(createdPost.getPost_id());

        // Assert
        assertThat(fetchedPost).isPresent();
        assertThat(fetchedPost.get().getClient_id()).isEqualTo("clientA");
    }

    @Test
    void testUpdatePost_SuccessfulUpdate() {
        // Arrange
        Post savedPost = postRepository.save(createValidTestPost("clientB"));
        String postId = savedPost.getPost_id();

        Post updateData = new Post();
        updateData.setDescription("New Updated Description");
        updateData.setPrice(99.99); // Price change

        // Act
        Post updatedPost = postService.updatePost(postId, updateData);

        // Assert
        assertThat(updatedPost).isNotNull();
        assertThat(updatedPost.getDescription()).isEqualTo("New Updated Description");
        assertThat(updatedPost.getPrice()).isEqualTo(99.99);
        assertThat(updatedPost.getDate_modified()).isAfter(updatedPost.getDate_created());
    }

    @Test
    void testHidePost_ChangesStatus() {
        // Arrange
        Post savedPost = postRepository.save(createValidTestPost("clientC"));
        String postId = savedPost.getPost_id();

        // Act
        boolean hidden = postService.hidePost(postId);
        Post postAfterHide = postService.getPostById(postId).orElseThrow();

        // Assert
        assertThat(hidden).isTrue();
        assertThat(postAfterHide.getStatus()).isEqualTo("hidden");
        assertThat(postAfterHide.getDate_modified()).isAfter(postAfterHide.getDate_created());
    }

    // --- Favourite Tests ---

    @Test
    void testFavourite_Successful() {
        // Arrange
        Post savedPost = postRepository.save(createValidTestPost("owner1"));
        String postId = savedPost.getPost_id();
        String clientId = "fan1";

        // Act
        boolean result = postService.favourite(postId, clientId);

        // Assert
        assertThat(result).isTrue();
        // Check if the entry exists in the favourite repository
        assertThat(favouriteRepository.existsByIdPostIdAndIdClientId(postId, clientId)).isTrue();
    }

    @Test
    void testFavourite_PostNotFound_ThrowsException() {
        // Arrange
        String nonExistentPostId = "non-existent-id";
        String clientId = "fan2";

        // Act & Assert
        assertThrows(NoSuchElementException.class, () -> {
            postService.favourite(nonExistentPostId, clientId);
        });
    }

    @Test
    void testFavourite_AlreadyExists_ReturnsFalse() {
        // Arrange
        Post savedPost = postRepository.save(createValidTestPost("owner2"));
        String postId = savedPost.getPost_id();
        String clientId = "fan3";

        // Setup initial favourite
        postService.favourite(postId, clientId);

        // Act
        boolean result = postService.favourite(postId, clientId); // Attempt to favourite again

        // Assert
        assertThat(result).isFalse();
        // Verify only one entry exists (not strictly necessary but confirms logic)
        assertThat(favouriteRepository.count()).isEqualTo(1);
    }
}
