package com.bondgraine.listingmicroservice.DTO;

public record PostEventDTO(
        String eventType,
        String postId,
        String userId,
        String clientId
) {}