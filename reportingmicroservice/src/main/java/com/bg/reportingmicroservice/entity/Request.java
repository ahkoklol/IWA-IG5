package com.bg.reportingmicroservice.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Data;

import java.util.Date;

@Data
@Entity
@Table(name = "request")
public class Request {

    @Id
    @Column(name = "request_id")
    private String requestId;

    private Date date;
    private String description;

    @Column(name = "post_id")
    private String postId;
}
