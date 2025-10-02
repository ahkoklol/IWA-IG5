/*package com.ai.aimicroservice.config;

import io.micrometer.observation.ObservationRegistry;
import org.springframework.ai.chat.model.ChatModel;
import org.springframework.ai.mistralai.MistralAiChatModel;
import org.springframework.ai.mistralai.MistralAiChatOptions;
import org.springframework.ai.mistralai.api.MistralAiApi;
import org.springframework.ai.model.tool.ToolCallingManager;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.retry.support.RetryTemplate;

import static org.springframework.ai.mistralai.api.MistralAiApi.ChatModel.SMALL;

@Configuration
public class MistralConfig {

    @Bean
    public ChatModel mistralChatModel() {
        var mistralAiApi = new MistralAiApi("key");

        var options = MistralAiChatOptions.builder()
                .model(SMALL)
                .temperature(0.7)
                .build();

        var toolManager = ToolCallingManager.builder().build();
        var retryTemplate = RetryTemplate.defaultInstance();
        var observationRegistry = ObservationRegistry.NOOP;

        return new MistralAiChatModel(
                mistralAiApi,
                options,
                toolManager,
                retryTemplate,
                observationRegistry
        );
    }
}*/