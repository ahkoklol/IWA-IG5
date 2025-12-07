package com.bg.reportingmicroservice;

import org.springframework.boot.SpringApplication;

public class TestReportingmicroserviceApplication {

	public static void main(String[] args) {
		SpringApplication.from(ReportingmicroserviceApplication::main).with(TestcontainersConfiguration.class).run(args);
	}

}
