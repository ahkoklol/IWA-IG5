package com.ai.aimicroservice;

import org.springframework.boot.SpringApplication;

public class TestAimicroserviceApplication {

	public static void main(String[] args) {
		SpringApplication.from(AimicroserviceApplication::main).with(TestcontainersConfiguration.class).run(args);
	}

}
