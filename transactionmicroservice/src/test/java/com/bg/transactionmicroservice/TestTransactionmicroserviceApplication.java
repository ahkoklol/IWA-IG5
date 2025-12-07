package com.bg.transactionmicroservice;

import org.springframework.boot.SpringApplication;

public class TestTransactionmicroserviceApplication {

	public static void main(String[] args) {
		SpringApplication.from(TransactionmicroserviceApplication::main).with(TestcontainersConfiguration.class).run(args);
	}

}
