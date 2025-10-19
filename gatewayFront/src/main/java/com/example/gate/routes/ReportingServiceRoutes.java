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
public class ReportingServiceRoutes extends BaseRoutes {

    @Bean
    @Override
    public RouterFunction<ServerResponse> routes() {
        return GatewayRouterFunctions.route("reporting_service")
                .route(RequestPredicates.path("/reports/**"),
                        HandlerFunctions.http("http://reporting-service"))
                .route(RequestPredicates.path("/api/reports/**"),
                        HandlerFunctions.http("http://reporting-service"))
                .build();
    }
}
