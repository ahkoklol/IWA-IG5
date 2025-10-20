package com.bondgraine.listingmicroservice;

import com.bondgraine.listingmicroservice.entity.Post;
import com.bondgraine.listingmicroservice.grpc.BuyPostRequest;
import com.bondgraine.listingmicroservice.grpc.BuyPostResponse;
import com.bondgraine.listingmicroservice.service.ListingServiceImpl;
import com.bondgraine.listingmicroservice.service.PostService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class ListingServiceImplTest {

    @Mock
    private PostService postService;

    @InjectMocks
    private ListingServiceImpl listingServiceImpl;

    private static final String POST_ID = "testpostid";
    private BuyPostRequest buyPostRequest;

    @BeforeEach
    void setUp() {
        buyPostRequest = BuyPostRequest.newBuilder()
                .setPostId(POST_ID)
                .build();
    }

    @Test
    void buyPost_ShouldReturnSuccess_WhenStatusIsSold() {
        Post soldPost = new Post();
        soldPost.setStatus("sold");

        when(postService.buyPost(POST_ID)).thenReturn(soldPost);

        BuyPostResponse response = listingServiceImpl.buyPost(buyPostRequest);

        assertTrue(response.getSuccess());
    }

    @Test
    void buyPost_ShouldReturnFailure_WhenStatusIsNotSold() {
        Post pendingPost = new Post();
        pendingPost.setStatus("pending");

        when(postService.buyPost(POST_ID)).thenReturn(pendingPost);

        BuyPostResponse response = listingServiceImpl.buyPost(buyPostRequest);

        assertFalse(response.getSuccess());
        assertEquals("The post could not be bought, current status: " + "pending",
                response.getErrorMessage());
    }
}