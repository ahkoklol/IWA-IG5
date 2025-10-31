package com.example.gate.routes;

import com.example.gate.routes.BaseRoutes;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.function.RequestPredicates;
import org.springframework.web.servlet.function.RouterFunction;
import org.springframework.web.servlet.function.ServerResponse;
import org.springframework.cloud.gateway.server.mvc.handler.HandlerFunctions;
import org.springframework.cloud.gateway.server.mvc.handler.GatewayRouterFunctions;

@Configuration
public class ClientServiceRoutes extends BaseRoutes {

    @Bean("clientServiceRoutes")
    @Override
    public RouterFunction<ServerResponse> routes() {
        return GatewayRouterFunctions.route("user_service")
                .route(RequestPredicates.path("/users/**"),
                        HandlerFunctions.http("http://user-service"))
                .route(RequestPredicates.path("/api/users/**"),
                        HandlerFunctions.http("http://user-service"))
                .build();
    }
}
