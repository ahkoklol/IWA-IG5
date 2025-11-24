package com.bondgraine.listingmicroservice.service;

import com.bondgraine.listingmicroservice.DTO.PostEventDTO;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@Service
public class PostEventProducer {

    private static final Logger log = LoggerFactory.getLogger(PostEventProducer.class);

    private static final String TOPIC_POST_EVENTS = "post-events";

    private final KafkaTemplate<String, String> kafkaTemplate;

    private final ObjectMapper objectMapper;

    public PostEventProducer(KafkaTemplate<String, String> kafkaTemplate, ObjectMapper objectMapper) {
        this.kafkaTemplate = kafkaTemplate;
        this.objectMapper = objectMapper;
    }

    /**
     * Publishes a Post event to Kafka.
     * @param postId the id of the post
     * @param userId the id of the user performing the event
     * @param clientId the id of the client receiving the event
     */
    public void sendPostEvent(String eventType, String postId, String userId, String clientId) {
        PostEventDTO postEventDTO = new PostEventDTO(eventType, postId, userId, clientId);
        log.info("Sending post event to topic {}: {}", TOPIC_POST_EVENTS, postEventDTO);

        try {
            String eventJson = objectMapper.writeValueAsString(postEventDTO);
            kafkaTemplate.send(TOPIC_POST_EVENTS, eventJson)
                    .whenComplete((result, ex) -> {
                        if (ex == null) {
                            log.info("Event sent successfully for post {}", postId);
                        } else {
                            log.error("Failed to send event for post {}: {}", postId, ex.getMessage());
                        }
                    });
        } catch (JsonProcessingException e) {
            log.error("Error serializing event for post {}: {}", postId, e.getMessage());
            throw new RuntimeException(e);
        }
    }
}