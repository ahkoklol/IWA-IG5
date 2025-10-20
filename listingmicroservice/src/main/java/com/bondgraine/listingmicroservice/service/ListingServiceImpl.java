package com.bondgraine.listingmicroservice.service;

import com.bondgraine.listingmicroservice.entity.Post;
import com.bondgraine.listingmicroservice.grpc.BuyPostRequest;
import com.bondgraine.listingmicroservice.grpc.BuyPostResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.grpc.server.service.GrpcService;

@GrpcService
public class ListingServiceImpl {

    private static final Logger log = LoggerFactory.getLogger(ListingServiceImpl.class);

    private final PostService postService;

    public ListingServiceImpl(PostService postService) {
        this.postService = postService;
    }

    public BuyPostResponse buyPost(BuyPostRequest buyPostRequest) {
        Post buyPostResponse = postService.buyPost(buyPostRequest.getPostId());
        if (buyPostResponse.getStatus().equals("sold")) {
            log.info("Sold Post Successfully");
            return BuyPostResponse.newBuilder()
                    .setSuccess(true)
                    .build();
        } else {
            log.info("Sold Post Failed");
            return BuyPostResponse.newBuilder()
                    .setSuccess(false)
                    .setErrorMessage("The post could not be bought, current status: " + buyPostResponse.getStatus())
                    .build();
        }
    }

}
