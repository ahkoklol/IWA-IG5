package com.bg.usermicroservice.entity;

import lombok.Data;

import java.util.Date;

@Data
public class ClientReviewDTO {
    private String buyerId;
    private String postId;
    private int rating;
    private String comment;
    private Date dateCreated;
    private Date dateModified;
    private String sellerId;
}
