package com.bondgraine.listingmicroservice.service;

import com.bondgraine.listingmicroservice.entity.Post;
import com.bondgraine.listingmicroservice.grpc.*;
import com.google.protobuf.Timestamp;
import io.grpc.Status;
import io.grpc.StatusRuntimeException;
import io.grpc.stub.StreamObserver;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.grpc.server.service.GrpcService;

import java.util.Date;
import java.util.Optional;
import java.util.concurrent.TimeUnit;

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

    public void getPost(GetPostRequest request, StreamObserver<GetPostResponse> responseObserver) {
        log.info("Received getPost request for postId: {}", request.getPostId());

        try {
            Optional<Post> postOptional = postService.getPostById(request.getPostId());

            if (postOptional.isEmpty()) {
                log.error("Post {} not found.", request.getPostId());
                responseObserver.onError(Status.NOT_FOUND
                        .withDescription("Post not found with ID: " + request.getPostId())
                        .asRuntimeException());
                return;
            }

            Post post = postOptional.get();

            GetPostResponse response = GetPostResponse.newBuilder()
                    .setPostId(post.getPostId())
                    .addAllPhoto(post.getPhotos())
                    .setWeight(post.getWeight())
                    .setQuantity(post.getQuantity())
                    .setType(post.getType())
                    .setSeason(post.getSeason())
                    .setEdible(post.isEdible())
                    .setFloweringSeason(post.getFloweringSeason())
                    .setHarvestDate(dateToTimestamp(post.getHarvestDate()))
                    .setPrice(post.getPrice())
                    .setStatus(post.getStatus())
                    .setClientId(post.getClientId())
                    .setDateCreated(dateToTimestamp(post.getDateCreated()))
                    .setDateModified(dateToTimestamp(post.getDateModified()))
                    .build();

            log.info("Successfully retrieved post {}.", request.getPostId());
            responseObserver.onNext(response);
            responseObserver.onCompleted();

        } catch (StatusRuntimeException e) {
            responseObserver.onError(e);
        } catch (Exception e) {
            log.error("Error processing getPost request for postId: {}", request.getPostId(), e);
            responseObserver.onError(Status.INTERNAL
                    .withDescription("Internal error retrieving post: " + e.getMessage())
                    .withCause(e)
                    .asRuntimeException());
        }
    }

    /**
     * Helper method to convert a java.util.Date to google.protobuf.Timestamp
     * @param date a Date
     * @return a Timestamp
     */
    private Timestamp dateToTimestamp(Date date) {
        if (date == null) {
            return null; // Or return a default/empty Timestamp builder if 'null' is not allowed
        }
        long milliseconds = date.getTime();
        long seconds = TimeUnit.MILLISECONDS.toSeconds(milliseconds);
        int nanos = (int) TimeUnit.MILLISECONDS.toNanos(milliseconds - TimeUnit.SECONDS.toMillis(seconds));

        return Timestamp.newBuilder()
                .setSeconds(seconds)
                .setNanos(nanos)
                .build();
    }

    /**
     * Helper method to convert a google.protobuf.timestamp to java.util.Date.
     * @param timestamp a Timestamp
     * @return a Date
     */
    private Date timestampToDate(Timestamp timestamp) {
        if (timestamp == null) {
            return null;
        }
        long milliseconds = TimeUnit.SECONDS.toMillis(timestamp.getSeconds())
                + TimeUnit.NANOSECONDS.toMillis(timestamp.getNanos());
        return new Date(milliseconds);
    }
}