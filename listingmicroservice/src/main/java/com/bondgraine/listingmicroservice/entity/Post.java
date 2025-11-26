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
    @Column(name = "post_id")
    private String postId;

    @Column(name = "date_created")
    private Date dateCreated;

    @Column(name = "date_modified")
    private Date dateModified;

    private String description;

    @Convert(converter = StringListConverter.class)
    private List<String> photos;

    private double weight;
    private int quantity;

    @Enumerated(EnumType.STRING)
    private Category category;
    private String season; // periode de plantation
    private boolean edible;

    @Column(name = "flowering_season")
    private String floweringSeason;

    @Column(name = "harvest_date")
    private String harvestDate;

    private double price;
    private String status;

    @Column(name = "client_id")
    private String clientId;
}