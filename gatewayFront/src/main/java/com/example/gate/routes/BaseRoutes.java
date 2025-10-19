package com.example.gate.routes;

import org.springframework.web.servlet.function.RouterFunction;
import org.springframework.web.servlet.function.ServerResponse;

public abstract class BaseRoutes {
    public abstract RouterFunction<ServerResponse> routes();
}
