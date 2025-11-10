package com.ai.aimicroservice.llm;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.ai.chat.model.ChatResponse;
import org.springframework.ai.chat.prompt.Prompt;
import org.springframework.ai.mistralai.MistralAiChatModel;
import org.springframework.stereotype.Component;

@Component
public class Mistral implements LLM {

    private static final Logger log = LoggerFactory.getLogger(Mistral.class);

    private final MistralAiChatModel chatModel;

    public Mistral(MistralAiChatModel chatModel) {
        this.chatModel = chatModel;
    }

    @Override
    public String generateTextAnalysis(String text) {
        ChatResponse response = chatModel.call(
                new Prompt(
                        """
                        You are a strict compliance assistant for a marketplace that only allows legal seed selling.
                        
                        Task: Determine if a text is **directly about selling or describing legal seeds, vegetables, fruits, nuts, or flowers**, and check for any inappropriate language anywhere in the text.
                    
                        Rules:
                        1. If the text contains any inappropriate words or profanity, the verdict is FALSE, regardless of the main topic.
                        2. If the text is off-topic (electronics, hobbies, etc.), the verdict is FALSE.
                        3. First provide a short reasoning (1–2 sentences).
                        4. On the **next line**, output exactly TRUE or FALSE (uppercase) with no punctuation.
                    
                        Text: %s
                        """.formatted(text)
                )
        );

        String content = response.getResult().getOutput().getText();
        log.info("Mistral result: {}", content);
        return content;
    }
}
