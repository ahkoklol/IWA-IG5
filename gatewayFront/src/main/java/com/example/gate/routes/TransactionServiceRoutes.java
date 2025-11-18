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
public class TransactionServiceRoutes implements BaseRoutes {

    private static final Logger log = LoggerFactory.getLogger(TransactionServiceRoutes.class);
    private static final String TRANSACTION_SERVICE_URI = "lb://transactionmicroservice";

    @Bean("transactionServiceRoutesBean")
    @Override
    public RouterFunction<ServerResponse> routes() {
        HandlerFunction<ServerResponse> transactionServiceHandler = HandlerFunctions.http(TRANSACTION_SERVICE_URI);

        return GatewayRouterFunctions.route("transaction_service")
                .before(BeforeFilterFunctions.addRequestHeader("X-Gateway-Source", "TransactionServiceGateway"))
                .before(request -> {
                    log.info("Routing request to transaction service: {} {}",
                            request.method(), request.uri().getPath());
                    return request;
                })
                // Purchase endpoint
                .route(RequestPredicates.POST("/transaction/purchase"), transactionServiceHandler)

                // Get transactions by client ID
                .route(RequestPredicates.GET("/transaction/{clientId}"), transactionServiceHandler)

                .build();
    }
}