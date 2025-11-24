package com.bg.notificationmicroservice.entity;

import lombok.Data;

@Data
public class PostEventDTO {
    String eventType;
    String postId;
    String userId; // the event initiator
    String clientId; // the client who needs the notification
}
