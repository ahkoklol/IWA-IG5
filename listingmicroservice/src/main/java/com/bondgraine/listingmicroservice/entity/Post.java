package com.bondgraine.listingmicroservice.entity;

import com.bondgraine.listingmicroservice.converter.StringListConverter;
import jakarta.persistence.*;
import lombok.Data;

import java.util.Date;
import java.util.List;

@Data
@Entity
@Table(name = "post")
public class Post {

    @Id
    @Column(name = "postId") // Mapping Java 'postId' to DB 'postid' (lowercase in Postgres)
    private String postId;

    @Column(name = "dateCreated")
    private Date dateCreated;

    @Column(name = "dateModified")
    private Date dateModified;

    private String description;

    @Convert(converter = StringListConverter.class)
    private List<String> photos;

    private double weight;
    private int quantity;
    private String type;
    private String season;
    private boolean edible;

    @Column(name = "floweringSeason")
    private String floweringSeason;

    @Column(name = "harvestDate")
    private Date harvestDate;

    private double price;
    private String status;

    @Column(name = "clientId") // Mapping Java 'clientId' to DB 'clientid'
    private String clientId;
}