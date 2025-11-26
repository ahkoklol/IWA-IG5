package com.bg.reportingmicroservice;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;

@SpringBootApplication
@EnableDiscoveryClient
public class ReportingmicroserviceApplication {

	public static void main(String[] args) {
		SpringApplication.run(ReportingmicroserviceApplication.class, args);
	}

}
