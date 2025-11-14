package com.bg.notificationmicroservice.config;

import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Component;

@Component
public class KafkaListeners {

    @KafkaListener(
            topics = "${notification.kafka.topics}",
            groupId = "${spring.kafka.consumer.group-id}"
    )
    void listener(String data){
        System.out.println("Listener received: " + data);
    }
}
