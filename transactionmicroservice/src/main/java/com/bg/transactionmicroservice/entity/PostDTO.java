package com.bg.transactionmicroservice.entity;

import lombok.Data;

@Data
public class PostDTO {
    private String postId;
    private double price;
    private String clientId;
}
