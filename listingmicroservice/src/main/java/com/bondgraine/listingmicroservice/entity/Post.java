package com.bondgraine.listingmicroservice.entity;

import jakarta.persistence.*;
import lombok.Data;

import java.util.Date;
import java.util.List;

@Data
@Entity
@Table(name = "post")
public class Post {

    @Id
    private String post_id;
    private Date date_created;
    private Date date_modified;
    private String description;

    @ElementCollection
    private List<String> photos;

    private double weight;
    private int quantity;
    private String type;
    private String season;
    private boolean edible;
    private String flowering_season;
    private Date harvest_date;
    private double price;
    private String status;
    private String client_id;
}