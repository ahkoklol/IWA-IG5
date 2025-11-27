package com.bg.usermicroservice.service;

import com.bg.usermicroservice.DTO.ReviewEventDTO;
import com.bg.usermicroservice.entity.ClientReviewId;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;

@Service
public class ReviewEventProducer {

    private static final Logger log = LoggerFactory.getLogger(ReviewEventProducer.class);

    private static final String TOPIC_REVIEW_EVENTS = "review-events";

    private final KafkaTemplate<String, String> kafkaTemplate;

    private final ObjectMapper objectMapper;

    public ReviewEventProducer(KafkaTemplate<String, String> kafkaTemplate, ObjectMapper objectMapper) {
        this.kafkaTemplate = kafkaTemplate;
        this.objectMapper = objectMapper;
    }

    /**
     * Publishes a Review event to Kafka.
     * @param reviewId the id of the ClientReview
     * @param userId the id of the user performing the event
     * @param clientId the id of the client receiving the event
     */
    public void sendReviewEvent(String eventType, ClientReviewId reviewId, String userId, String clientId) {
        ReviewEventDTO reviewEventDTO = new ReviewEventDTO(eventType, reviewId, userId, clientId);
        log.info("Sending review event to topic {}: {}", TOPIC_REVIEW_EVENTS, reviewEventDTO);

        try {
            String eventJson = objectMapper.writeValueAsString(reviewEventDTO);
            kafkaTemplate.send(TOPIC_REVIEW_EVENTS, eventJson)
                    .whenComplete((result, ex) -> {
                        if (ex == null) {
                            log.info("Event sent successfully for review {}", reviewId);
                        } else {
                            log.error("Failed to send event for review {}: {}", reviewId, ex.getMessage());
                        }
                    });
        } catch (JsonProcessingException e) {
            log.error("Error serializing event for review {}: {}", reviewId, e.getMessage());
            throw new RuntimeException(e);
        }
    }
}