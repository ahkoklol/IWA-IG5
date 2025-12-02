package com.bg.transactionmicroservice.entity;

import lombok.Data;

@Data
public class ClientDTO {
    private String clientId;
    private String email;
    private String stripeId;
}
