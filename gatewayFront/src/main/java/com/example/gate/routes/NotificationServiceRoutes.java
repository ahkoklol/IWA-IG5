package com.example.gate.routes;

import org.springframework.cloud.gateway.server.mvc.filter.BeforeFilterFunctions;
import org.springframework.cloud.gateway.server.mvc.handler.GatewayRouterFunctions;
import org.springframework.cloud.gateway.server.mvc.handler.HandlerFunctions;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.function.HandlerFunction;
import org.springframework.web.servlet.function.RequestPredicates;
import org.springframework.web.servlet.function.RouterFunction;
import org.springframework.web.servlet.function.ServerResponse;

import java.util.logging.Logger;

@Configuration
public class NotificationServiceRoutes implements BaseRoutes{

    private static final String NOTIFICATION_SERVICE_URI = "lb://notificationmicroservice";
    private static final Logger logger = Logger.getLogger(NotificationServiceRoutes.class.getName());
    @Bean("notificationServiceRoutesBean")
    @Override
    public RouterFunction<ServerResponse> routes() {
        HandlerFunction<ServerResponse> notificationServiceHandler = HandlerFunctions.http(NOTIFICATION_SERVICE_URI);

        // Implement routing logic for notification service here
        logger.info("NotificationServiceRoutes initialized with URI: " + NOTIFICATION_SERVICE_URI);
        return GatewayRouterFunctions.route("notification_service")
                // Define routes here
                .before(BeforeFilterFunctions.addRequestHeader("X-Gateway-Source", "NotificationServiceGateway"))
                .route(RequestPredicates.POST("/notification"), notificationServiceHandler)

                .route(RequestPredicates.GET("/notification/{clientId"), notificationServiceHandler)

                .route(RequestPredicates.PUT("/notification/{notificationId}"), notificationServiceHandler)


                .build();
    }


}
