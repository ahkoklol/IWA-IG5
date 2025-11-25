package com.ai.aimicroservice.entity;

import jakarta.persistence.Column;
import lombok.Data;

import java.util.Date;

@Data
public class ReportDTO {
    private String description;
    private Date date;

    @Column(name = "client_id")
    private String clientId;

    @Column(name = "post_id")
    private String postId;
}
