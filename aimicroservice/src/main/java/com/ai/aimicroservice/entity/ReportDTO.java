package com.ai.aimicroservice.entity;

import lombok.Data;

import java.util.Date;

@Data
public class ReportDTO {
    private String description;
    private Date date;
    private String clientId;
    private String postId;
}
