package com.bg.notificationmicroservice.controller;

import com.bg.notificationmicroservice.entity.Notification;
import com.bg.notificationmicroservice.service.NotificationService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/notification")
public class NotificationController {

    private static final Logger log = LoggerFactory.getLogger(NotificationController.class);

    private final NotificationService notificationService;

    public NotificationController(NotificationService notificationService) {
        this.notificationService = notificationService;
    }

    @PostMapping
    public ResponseEntity<Notification> createNotification(@RequestBody Notification notification) {
        Notification createdNotification = notificationService.createNotification(notification);
        if (createdNotification == null) {
            log.warn("Notification could not be created");
            return ResponseEntity.badRequest().build();
        }
        log.info("Notification created");
        return ResponseEntity.ok(createdNotification);
    }

    @GetMapping("/{clientId}")
    public ResponseEntity<List<Notification>> getNotifications(@PathVariable String clientId) {
        List<Notification> notificationList = notificationService.getAllNotifications(clientId);
        if (notificationList.isEmpty()) {
            log.info("No notifications for client {}", clientId);
        }
        log.info("Found {} notifications", notificationList.size());
        return ResponseEntity.ok(notificationList);
    }

    @PutMapping("/{notificationId}")
    public ResponseEntity<Void> markNotificationAsRead(@PathVariable String notificationId) {
        notificationService.markNotificationAsRead(notificationId);
        return ResponseEntity.ok().build();
    }

}
