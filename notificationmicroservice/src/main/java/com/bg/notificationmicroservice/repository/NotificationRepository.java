package com.bg.notificationmicroservice.repository;

import com.bg.notificationmicroservice.entity.Notification;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface NotificationRepository extends JpaRepository<Notification, String> {
    List<Notification> findAllByClientIdOrderByDateDesc(String clientId);
}
