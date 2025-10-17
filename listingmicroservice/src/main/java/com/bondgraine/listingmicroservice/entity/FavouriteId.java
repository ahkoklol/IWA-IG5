package com.bondgraine.listingmicroservice.entity;

import jakarta.persistence.Embeddable;
import lombok.Data;

import java.io.Serializable;

// This class will be embedded into the Favourite entity to define the PK
@Data
@Embeddable
public class FavouriteId implements Serializable {

    private String clientId;

    private String postId;

    // NOTE: JPA requires default constructor for embedded IDs
    public FavouriteId() {}

    public FavouriteId(String postId, String clientId) {
        this.clientId = clientId;
        this.postId = postId;
    }

    // Lombok's @Data automatically generates the required equals() and hashCode()
    // which are mandatory for composite primary keys.
}