package com.bg.usermicroservice.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Data;

import java.util.Date;

@Data
@Entity
@Table(name = "client")
public class Client {

    @Id
    @Column(name = "client_id")
    private String clientId;

    private String address;
    private String nationality;
    private String phone;
    private String photo;

    @Column(name = "stripe_id")
    private String stripeId;

    @Column(name = "date_modified")
    private Date dateModified;

    @Column(name = "date_of_birth")
    private Date dateOfBirth;

    @Column(name = "user_id")
    private String userId;

    @Column(name = "photo_id")
    private String photoId;
}
