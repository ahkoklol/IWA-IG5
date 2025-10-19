package com.bondgraine.listingmicroservice.service;

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


}
