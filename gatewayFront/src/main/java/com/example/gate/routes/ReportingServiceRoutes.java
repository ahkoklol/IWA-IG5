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
public class ReportingServiceRoutes implements BaseRoutes {

    private static final Logger log = LoggerFactory.getLogger(ReportingServiceRoutes.class);
    private static final String REPORTING_SERVICE_URI = "lb://reportingmicroservice";

    @Bean("reportingServiceRoutesBean")
    @Override
    public RouterFunction<ServerResponse> routes() {
        HandlerFunction<ServerResponse> reportingServiceHandler = HandlerFunctions.http(REPORTING_SERVICE_URI);

        return GatewayRouterFunctions.route("reporting_service")
                .before(BeforeFilterFunctions.addRequestHeader("X-Gateway-Source", "ReportingServiceGateway"))
                .before(request -> {
                    log.info("Routing request to reporting service: {} {}",
                            request.method(), request.uri().getPath());
                    return request;
                })
                // Report endpoints
                .route(RequestPredicates.POST("/reporting/report/{postId}"), reportingServiceHandler)
                .route(RequestPredicates.GET("/reporting/report/{postId}"), reportingServiceHandler)
                .route(RequestPredicates.DELETE("/reporting/report/{postId}"), reportingServiceHandler)

                // Request endpoints
                .route(RequestPredicates.POST("/reporting/request/{postId}"), reportingServiceHandler)
                .route(RequestPredicates.GET("/reporting/request/{postId}"), reportingServiceHandler)
                .route(RequestPredicates.DELETE("/reporting/request/{postId}"), reportingServiceHandler)

                .build();
    }
}
