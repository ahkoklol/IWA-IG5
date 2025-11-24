package com.bg.transactionmicroservice.client;

import com.bondgraine.listingmicroservice.grpc.GetPostRequest;
import com.bondgraine.listingmicroservice.grpc.GetPostResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.bondgraine.listingmicroservice.grpc.ListingServiceGrpc.ListingServiceBlockingStub;

@Service
public class ListingClient {

    private ListingServiceBlockingStub listingClientStub;

    @Autowired
    public ListingClient(ListingServiceBlockingStub listingClientStub) {
        this.listingClientStub = listingClientStub;
    }

    public GetPostResponse getPost(GetPostRequest getPostRequest) {
        return listingClientStub.getPost(getPostRequest);
    }
}
