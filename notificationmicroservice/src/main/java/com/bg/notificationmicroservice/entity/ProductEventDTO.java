package com.bg.notificationmicroservice.entity;

import lombok.Data;

@Data
public class ProductEventDTO {
    String eventType;
    String productId;
    String userId; // the event initiator
    String clientId; // the client who needs the notification
}
