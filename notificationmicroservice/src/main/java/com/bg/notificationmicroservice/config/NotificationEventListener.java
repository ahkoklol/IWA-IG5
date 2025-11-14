package com.bg.notificationmicroservice.config;

import com.bg.notificationmicroservice.entity.Notification;
import com.bg.notificationmicroservice.entity.ProductEventDTO;
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

    @KafkaListener(topics = "${notification.kafka.topics}", groupId = "${spring.kafka.consumer.group-id}")
    void listener(String rawEventData){
        log.info("⚡Received raw event: {}", rawEventData);
        try {
            // 1. Deserialize the raw String into your structured DTO
            // 2. Map the event data to your Notification Entity
            // 3. Call your service logic to save the notification
            ProductEventDTO event = objectMapper.readValue(rawEventData, ProductEventDTO.class);
            Notification notification = createNotificationFromEvent(event);
            Notification savedNotification = notificationService.createNotification(notification);
            log.info("Notification created for client {}. Type: {}",
                    savedNotification.getClientId(), savedNotification.getType());
        } catch (Exception e) {
            log.error("Error processing Kafka message: {}", rawEventData, e);
            // Consider sending the failed message to a Dead Letter Topic (DLT) in a production setup
        }
    }

    /**
     * Maps the event data into NotificationEntity
     * @param event the kafka event
     * @return a Notification object
     */
    private Notification createNotificationFromEvent(ProductEventDTO event) {
        Notification notification = new Notification();
        notification.setClientId(event.getClientId());
        notification.setType(event.getEventType());
        String message = switch (event.getEventType()) {
            case "PRODUCT_BOUGHT" -> String.format("A new purchase was made for product %s.", event.getProductId());
            case "PRODUCT_SOLD" -> String.format("Product %s has been sold.", event.getProductId());
            case "PRODUCT_LIKED" -> String.format("Product %s received a new like.", event.getProductId());
            default -> "An unknown product event occurred.";
        };
        notification.setMessage(message);
        return notification;
    }
}
