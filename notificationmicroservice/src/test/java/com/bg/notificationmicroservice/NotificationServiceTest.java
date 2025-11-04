package com.bg.notificationmicroservice;

import com.bg.notificationmicroservice.entity.Notification;
import com.bg.notificationmicroservice.repository.NotificationRepository;
import com.bg.notificationmicroservice.service.NotificationService;
import jakarta.transaction.Transactional;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;

import java.util.Date;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertThrows;

@Transactional
public class NotificationServiceTest extends PostgresTestcontainer {

    @Autowired
    private NotificationRepository notificationRepository;

    @Autowired
    private NotificationService notificationService;

    private Notification defaultNotification;

    @BeforeEach
    public void setup() {
        Notification notification = new Notification();
        notification.setNotificationId("notificationid");
        notification.setMessage("message");
        notification.setType("type");
        notification.setRead(false);
        notification.setDate(new Date());
        notification.setClientId("clientId");
        notificationRepository.save(notification);
        this.defaultNotification = notification;
    }

    @Test
    void testCreateNotification() {
        Notification notification = notificationService.createNotification(defaultNotification);

        Optional<Notification> resultNotification = notificationService.getNotification(notification.getNotificationId());

        assertThat(resultNotification).isPresent();
        assertThat(resultNotification.get().isRead()).isFalse();
    }

    @Test
    void testGetAllNotifications() {
        List<Notification> notificationList = notificationService.getAllNotifications(defaultNotification.getClientId());

        assertThat(notificationList).isNotEmpty();
        assertThat(notificationList.size()).isEqualTo(1);
        assertThat(notificationList.getFirst().isRead()).isFalse();
    }

    @Test
    void testMarkNotificationAsRead_Success() {
        notificationService.markNotificationAsRead(defaultNotification.getNotificationId());
        Optional<Notification> resultNotification = notificationService.getNotification(defaultNotification.getNotificationId());

        assertThat(resultNotification).isPresent();
        assertThat(resultNotification.get().isRead()).isTrue();
    }

    @Test
    void testMarkNotificationAsRead_Throws_IllegalArgumentException() {
        assertThrows(
                IllegalArgumentException.class,
                () -> notificationService.markNotificationAsRead("fakenotificationid")
        );
    }
}
