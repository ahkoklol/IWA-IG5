package com.bondgraine.listingmicroservice.service;

import com.bondgraine.listingmicroservice.entity.Post;
import com.bondgraine.listingmicroservice.grpc.BuyPostRequest;
import com.bondgraine.listingmicroservice.grpc.BuyPostResponse;
import com.bondgraine.listingmicroservice.grpc.ListingServiceGrpc;
import io.grpc.Status;
import io.grpc.StatusRuntimeException;
import io.grpc.stub.StreamObserver;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.grpc.server.service.GrpcService;

/**
 * gRPC Service implementation that handles requests for buying posts.
 */
@GrpcService
public class ListingServiceImpl {

    private static final Logger log = LoggerFactory.getLogger(ListingServiceImpl.class);

    private final PostService postService;

    public ListingServiceImpl(PostService postService) {
        this.postService = postService;
    }

    /**
     * Implements the unary gRPC method to handle the purchase of a post.
     * @param request The BuyPostRequest containing the postId.
     * @param responseObserver The observer used to send the response back to the client.
     */
    public void buyPost(BuyPostRequest request, StreamObserver<BuyPostResponse> responseObserver) {
        log.info("Received buyPost request for postId: {}", request.getPostId());
        BuyPostResponse response;

        try {
            Post post = postService.buyPost(request.getPostId());

            if (post.getStatus().equals("sold")) {
                log.info("Post {} sold successfully.", request.getPostId());
                response = BuyPostResponse.newBuilder()
                        .setSuccess(true)
                        .build();
            } else {
                log.info("Post {} purchase failed. Current status: {}.", request.getPostId(), post.getStatus());
                response = BuyPostResponse.newBuilder()
                        .setSuccess(false)
                        .setErrorMessage("The post could not be bought, current status: " + post.getStatus())
                        .build();
            }

            responseObserver.onNext(response);
            responseObserver.onCompleted();

        } catch (Exception e) {
            log.error("Error processing buyPost request for postId: {}", request.getPostId(), e);
            responseObserver.onError(e);
        }
    }
}
