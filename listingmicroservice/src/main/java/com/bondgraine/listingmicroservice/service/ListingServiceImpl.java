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
                    .setCategory(post.getCategoryId())
                    .setSeason(post.getSeason())
                    .setEdible(post.isEdible())
                    .setFloweringSeason(post.getFloweringSeason())
                    .setHarvestDate(post.getHarvestDate())
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