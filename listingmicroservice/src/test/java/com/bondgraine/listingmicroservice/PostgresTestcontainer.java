package com.bondgraine.listingmicroservice;

import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.DynamicPropertyRegistry;
import org.springframework.test.context.DynamicPropertySource;
import org.testcontainers.containers.PostgreSQLContainer;
import org.testcontainers.junit.jupiter.Container;
import org.testcontainers.junit.jupiter.Testcontainers;
import org.testcontainers.kafka.KafkaContainer;
import org.testcontainers.utility.DockerImageName;

@SpringBootTest
@Testcontainers
public class PostgresTestcontainer {
    // Define the container as a static field
    // The static modifier ensures the container is started only once for all tests in the same test suite.
    @Container
    public static PostgreSQLContainer<?> postgresContainer = new PostgreSQLContainer<>("postgres:15")
            .withDatabaseName("testdb")
            .withUsername("testuser")
            .withPassword("testpass");

    // Define the Kafka container
    @Container
    public static KafkaContainer kafkaContainer = new KafkaContainer("apache/kafka-native:3.8.0");

    // DynamicPropertySource updates Spring's configuration
    @DynamicPropertySource
    static void setDatasourceProperties(DynamicPropertyRegistry registry) {
        // These properties override what's in application.properties/yml
        registry.add("spring.datasource.url", postgresContainer::getJdbcUrl);
        registry.add("spring.datasource.username", postgresContainer::getUsername);
        registry.add("spring.datasource.password", postgresContainer::getPassword);
        // Important for table creation if you rely on JPA DDL generation
        registry.add("spring.jpa.hibernate.ddl-auto", () -> "create-drop");
        registry.add("spring.kafka.bootstrap-servers", kafkaContainer::getBootstrapServers);
    }
}
