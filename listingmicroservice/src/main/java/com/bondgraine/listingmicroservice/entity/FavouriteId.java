package com.bondgraine.listingmicroservice.entity;

import jakarta.persistence.Embeddable;
import lombok.Data;

import java.io.Serializable;

@Data
@Embeddable
public class FavouriteId implements Serializable {

    private String clientId;

    private String postId;

    public FavouriteId() {}

    public FavouriteId(String postId, String clientId) {
        this.clientId = clientId;
        this.postId = postId;
    }
}