package com.bondgraine.listingmicroservice;

import org.springframework.boot.SpringApplication;

public class TestListingmicroserviceApplication {

	public static void main(String[] args) {
		SpringApplication.from(ListingmicroserviceApplication::main).with(TestcontainersConfiguration.class).run(args);
	}

}
