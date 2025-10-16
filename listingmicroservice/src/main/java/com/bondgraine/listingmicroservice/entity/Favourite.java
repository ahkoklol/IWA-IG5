package com.bondgraine.listingmicroservice.entity;

import jakarta.persistence.EmbeddedId;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import jakarta.persistence.Temporal;
import jakarta.persistence.TemporalType;
import lombok.Data;

import java.util.Date;

@Data
@Entity
@Table(name = "favourite")
public class Favourite {

    // Define the composite key using the embedded ID class
    @EmbeddedId
    private FavouriteId id;

    // Define the non-key field
    @Temporal(TemporalType.TIMESTAMP) // Maps java.util.Date to a timestamp in the DB
    private Date date;

    // NOTE: You might need a default constructor here if not using Lombok's @NoArgsConstructor
}