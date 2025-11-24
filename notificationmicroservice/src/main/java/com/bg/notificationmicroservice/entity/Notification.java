package com.bg.notificationmicroservice.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Data;

import java.util.Date;

@Data
@Entity
@Table(name = "notification")
public class Notification {

    @Id
    @Column(name = "notification_id")
    private String notificationId;

    private String message;
    private String type;
    private boolean isRead;
    private Date date;

    @Column(name = "client_id")
    private String clientId;
}