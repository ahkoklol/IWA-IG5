package com.bg.notificationmicroservice.config;

import com.bg.notificationmicroservice.entity.Notification;
import com.bg.notificationmicroservice.entity.PostEventDTO;
import com.bg.notificationmicroservice.service.NotificationService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Component;

@Component
public class NotificationEventListener {

    private static final Logger log = LoggerFactory.getLogger(NotificationEventListener.class);

    private final ObjectMapper objectMapper = new ObjectMapper();

    private final NotificationService notificationService;

    public NotificationEventListener(NotificationService notificationService) {
        this.notificationService = notificationService;
    }

    @KafkaListener(topics = "#{'${notification.kafka.topics}'.split(',')}", groupId = "${spring.kafka.consumer.group-id}")
    void listener(String rawEventData){
        log.info("Received raw event: {}", rawEventData);
        try {
            // 1. Deserialize the raw String into the structured DTO
            // 2. Map the event data to the Notification Entity
            // 3. Call the service logic to save the notification
            PostEventDTO event = objectMapper.readValue(rawEventData, PostEventDTO.class);
            if (event == null || event.getEventType() == null) {
                log.warn("Received empty or invalid event");
                return;
            }
            Notification notification = createNotificationFromEvent(event);
            Notification savedNotification = notificationService.createNotification(notification);
            log.info("Notification created for client {}. Type: {}", savedNotification.getClientId(), savedNotification.getType());
        } catch (Exception e) {
            log.error("Error processing Kafka message: {}", rawEventData, e);
        }
    }

    /**
     * Maps the event data into NotificationEntity
     * @param event the kafka event
     * @return a Notification object
     */
    private Notification createNotificationFromEvent(PostEventDTO event) {
        Notification notification = new Notification();
        notification.setClientId(event.getClientId());
        notification.setType(event.getEventType());
        String message = switch (event.getEventType()) {
            case "PRODUCT_BOUGHT" -> String.format("A new purchase was made for product %s.", event.getPostId());
            case "PRODUCT_SOLD" -> String.format("Product %s has been sold.", event.getPostId());
            case "PRODUCT_LIKED" -> String.format("Product %s received a new like.", event.getPostId());
            case "REVIEW_LEFT" -> String.format("%s has left you a review.", event.getUserId());
            case "PRODUCT_REMOVED"  -> String.format("The product %s has been removed.", event.getPostId());
            case "REPOST_REQUEST_ACCEPTED" -> String.format("The product %s repost request has been accepted.", event.getPostId());
            case "REPOST_REQUEST_REJECTED"  -> String.format("The product %s repost request has been rejected.", event.getPostId());
            case "PRODUCT_BOUGHT_NOTIFY_FAVORITERS" -> String.format("The product %s in your favourites was bought", event.getPostId());
            default -> "An unknown product event occurred.";
        };
        notification.setMessage(message);
        return notification;
    }
}
