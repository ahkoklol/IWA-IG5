package com.bg.usermicroservice.entity;

import jakarta.persistence.Column;
import jakarta.persistence.EmbeddedId;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.Data;

import java.util.Date;

@Data
@Entity
@Table(name = "client_review")
public class ClientReview {

    @EmbeddedId
    private ClientReviewId ClientReviewId;

    private int rating;
    private String comment;

    @Column(name = "date_created")
    private Date dateCreated;

    @Column(name = "date_modified")
    private Date dateModified;

    @Column(name = "seller_id")
    private String sellerId;
}
