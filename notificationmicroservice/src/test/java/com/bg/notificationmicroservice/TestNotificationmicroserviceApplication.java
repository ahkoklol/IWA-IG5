package com.bg.notificationmicroservice;

import org.springframework.boot.SpringApplication;

public class TestNotificationmicroserviceApplication {

	public static void main(String[] args) {
		SpringApplication.from(NotificationmicroserviceApplication::main).with(TestcontainersConfiguration.class).run(args);
	}

}
