package com.bg.usermicroservice.DTO;

import com.bg.usermicroservice.entity.ClientReviewId;

public record ReviewEventDTO(
        String eventType,
        ClientReviewId reviewId,
        String userId,
        String clientId
) {}