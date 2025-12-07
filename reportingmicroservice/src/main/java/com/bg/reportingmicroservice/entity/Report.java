package com.bg.reportingmicroservice.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Data;

import java.util.Date;

@Data
@Entity
@Table(name = "report")
public class Report {

    @Id
    @Column(name = "report_id")
    private String reportId;

    private Date date;
    private String description;

    @Column(name = "client_id")
    private String clientId;

    @Column(name = "post_id")
    private String postId;
}
