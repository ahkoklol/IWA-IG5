package com.example.gate.routes;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.function.RequestPredicates;
import org.springframework.web.servlet.function.RouterFunction;
import org.springframework.web.servlet.function.ServerResponse;
import org.springframework.cloud.gateway.server.mvc.handler.HandlerFunctions;
import org.springframework.cloud.gateway.server.mvc.handler.GatewayRouterFunctions;

@Configuration
public class AuthServiceRoutes implements BaseRoutes{

    @Bean("authServiceRoutesBean")
    public RouterFunction<ServerResponse> routes() {
        return GatewayRouterFunctions.route("auth_service")
                .route(RequestPredicates.path("/auth/**"),
                        HandlerFunctions.http("http://auth-service"))
                .route(RequestPredicates.path("/api/auth/**"),
                        HandlerFunctions.http("http://auth-service"))
                .build();
    }
}
