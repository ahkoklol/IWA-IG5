package com.bg.usermicroservice;

import org.springframework.boot.SpringApplication;

public class TestUsermicroserviceApplication {

	public static void main(String[] args) {
		SpringApplication.from(UsermicroserviceApplication::main).with(TestcontainersConfiguration.class).run(args);
	}

}
