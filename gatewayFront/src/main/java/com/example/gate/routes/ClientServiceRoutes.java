package com.example.gate.routes;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.cloud.gateway.server.mvc.filter.BeforeFilterFunctions;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.function.RequestPredicates;
import org.springframework.web.servlet.function.RouterFunction;
import org.springframework.web.servlet.function.ServerResponse;
import org.springframework.cloud.gateway.server.mvc.handler.HandlerFunctions;
import org.springframework.cloud.gateway.server.mvc.handler.GatewayRouterFunctions;
import org.springframework.web.servlet.function.HandlerFunction;

@Configuration
public class ClientServiceRoutes implements BaseRoutes {

    private static final Logger log = LoggerFactory.getLogger(ClientServiceRoutes.class);
    private static final String USER_SERVICE_URI = "http://usermicroservice";

    @Bean("clientServiceRoutesBean")
    @Override
    public RouterFunction<ServerResponse> routes() {
        HandlerFunction<ServerResponse> userServiceHandler = HandlerFunctions.http(USER_SERVICE_URI);

        return GatewayRouterFunctions.route("user_service")
                .before(BeforeFilterFunctions.addRequestHeader("X-Gateway-Source", "ClientServiceGateway"))
                .before(request -> {
                    log.info("Routing request to user service: {} {}",
                            request.method(), request.uri().getPath());
                    return request;
                })
                .route(RequestPredicates.GET("/user/{clientId}"), userServiceHandler)
                .route(RequestPredicates.POST("/user/register"), userServiceHandler)
                .route(RequestPredicates.PUT("/user/{clientId}"), userServiceHandler)
                .route(RequestPredicates.DELETE("/user/{clientId}"), userServiceHandler)
                .route(RequestPredicates.GET("/user/{clientId}/reviews"), userServiceHandler)
                .route(RequestPredicates.POST("/user/{clientId}/review"), userServiceHandler)
                .route(RequestPredicates.POST("/user/{clientId}/photo"), userServiceHandler)
                .build();
    }
}