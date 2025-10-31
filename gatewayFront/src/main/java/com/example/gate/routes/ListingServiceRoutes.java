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
public class ListingServiceRoutes extends BaseRoutes {

    @Bean("listingServiceRoutes")
    @Override
    public RouterFunction<ServerResponse> routes() {
        return GatewayRouterFunctions.route("listing_service")
                .route(RequestPredicates.path("/listings/**"),
                        HandlerFunctions.http("http://listing-service"))
                .route(RequestPredicates.path("/api/listings/**"),
                        HandlerFunctions.http("http://listing-service"))
                .build();
    }
}
