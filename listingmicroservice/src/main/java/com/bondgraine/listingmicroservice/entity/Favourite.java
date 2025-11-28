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

    @EmbeddedId
    private FavouriteId id;

    @Temporal(TemporalType.TIMESTAMP)
    private Date date;
}