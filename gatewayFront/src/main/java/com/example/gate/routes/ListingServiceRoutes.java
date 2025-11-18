package com.example.gate.routes;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.cloud.gateway.server.mvc.filter.BeforeFilterFunctions;
import org.springframework.cloud.gateway.server.mvc.handler.HandlerFunctions;
import org.springframework.cloud.gateway.server.mvc.handler.GatewayRouterFunctions;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.function.RequestPredicates;
import org.springframework.web.servlet.function.RouterFunction;
import org.springframework.web.servlet.function.ServerResponse;
import org.springframework.web.servlet.function.HandlerFunction;

@Configuration
public class ListingServiceRoutes implements BaseRoutes {

    private static final Logger log = LoggerFactory.getLogger(ListingServiceRoutes.class);
    private static final String LISTING_SERVICE_URI = "lb://listingmicroservice";

    @Bean("listingServiceRoutesBean")
    @Override
    public RouterFunction<ServerResponse> routes() {
        HandlerFunction<ServerResponse> listingServiceHandler = HandlerFunctions.http(LISTING_SERVICE_URI);

        return GatewayRouterFunctions.route("listing_service")
                .before(BeforeFilterFunctions.addRequestHeader("X-Gateway-Source", "ListingServiceGateway"))
                .before(request -> {
                    log.info("Routing request to listing service: {} {}",
                            request.method(), request.uri().getPath());
                    return request;
                })
                // Get post by ID
                .route(RequestPredicates.GET("/post/{postId}"), listingServiceHandler)

                // Update post
                .route(RequestPredicates.PATCH("/post/{postId}"), listingServiceHandler)

                // Create post
                .route(RequestPredicates.POST("/post"), listingServiceHandler)

                // Hide/Unhide post
                .route(RequestPredicates.PATCH("/post/{postId}/hide"), listingServiceHandler)
                .route(RequestPredicates.PATCH("/post/{postId}/unhide"), listingServiceHandler)

                // Ban/Unban post
                .route(RequestPredicates.PATCH("/post/{postId}/ban"), listingServiceHandler)
                .route(RequestPredicates.PATCH("/post/{postId}/unban"), listingServiceHandler)

                // Favourite/Unfavourite
                .route(RequestPredicates.POST("/post/{postId}/favourite"), listingServiceHandler)
                .route(RequestPredicates.DELETE("/post/{postId}/favourite"), listingServiceHandler)

                // Get posts by client
                .route(RequestPredicates.GET("/post/{clientId}/sellList"), listingServiceHandler)
                .route(RequestPredicates.GET("/post/{clientId}/soldList"), listingServiceHandler)

                // Buy post
                .route(RequestPredicates.PATCH("/post/{postId}/buy"), listingServiceHandler)

                .build();
    }
}