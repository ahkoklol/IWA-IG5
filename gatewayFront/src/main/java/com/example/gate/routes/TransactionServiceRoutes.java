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
public class TransactionServiceRoutes extends BaseRoutes {

    @Bean("transactionServiceRoutes")
    @Override
    public RouterFunction<ServerResponse> routes() {
        return GatewayRouterFunctions.route("transaction_service")
                .route(RequestPredicates.path("/transactions/**"),
                        HandlerFunctions.http("http://transaction-service"))
                .route(RequestPredicates.path("/api/transactions/**"),
                        HandlerFunctions.http("http://transaction-service"))
                .build();
    }
}
