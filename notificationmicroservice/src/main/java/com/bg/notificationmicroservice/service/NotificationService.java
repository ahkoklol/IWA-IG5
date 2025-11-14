package com.bg.notificationmicroservice.service;

import com.bg.notificationmicroservice.controller.NotificationController;
import com.bg.notificationmicroservice.entity.Notification;
import com.bg.notificationmicroservice.repository.NotificationRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class NotificationService {

    private static final Logger log = LoggerFactory.getLogger(NotificationService.class);

    private final NotificationRepository notificationRepository;

    public NotificationService(NotificationRepository notificationRepository) {
        this.notificationRepository = notificationRepository;
    }

    /**
     * Creates a Notification
     * @param notification a notification with its message, type, clientId
     * @return a Notification object saved in the database
     */
    public Notification createNotification(Notification notification) {
        notification.setNotificationId(UUID.randomUUID().toString());
        notification.setRead(false);
        notification.setDate(new Date());
        return notificationRepository.save(notification);
    }

    /**
     * Fetches all notifications for a client
     * @param clientId the client id
     * @return a list of Notification objects ordered by descending order (most to least recent)
     */
    public List<Notification> getAllNotifications(String clientId) {
        return notificationRepository.findAllByClientIdOrderByDateDesc(clientId);
    }

    /**
     * Updates a notification read status as true
     * @param notificationId the id of the notification
     */
    public void markNotificationAsRead(String notificationId) {
        Optional<Notification> notification = getNotification(notificationId);

        if (notification.isEmpty()) {
            log.error("Notification with id: {} not found", notificationId);
            throw new IllegalArgumentException("Notification with id: " + notificationId + " not found");
        }

        notification.get().setRead(true);
        notificationRepository.save(notification.get());
    }

    /**
     * Helper to check if notificationId exists
     * @param notificationId the id of the notification
     * @return a Notification object if found
     */
    public Optional<Notification> getNotification(String notificationId) {
        return notificationRepository.findById(notificationId);
    }

    /**
     * Fetch all notifications for a client ordered by most to least recent
     * @param clientId the id of the client
     * @return a list of Notifications
     */
    public List<Notification> getNotifications(String clientId) {
        return notificationRepository.findAllByClientIdOrderByDateDesc(clientId);
    }

}
