package com.example.gate.routes;

import org.springframework.web.servlet.function.RouterFunction;
import org.springframework.web.servlet.function.ServerResponse;

public interface BaseRoutes {
    RouterFunction<ServerResponse> routes();
}
