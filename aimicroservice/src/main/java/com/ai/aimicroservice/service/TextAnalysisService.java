package com.ai.aimicroservice.service;

import com.ai.aimicroservice.llm.Mistral;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

@Service
public class TextAnalysisService {

    private static final Logger log = LoggerFactory.getLogger(TextAnalysisService.class);

    private final Mistral mistral;

    public TextAnalysisService(Mistral mistral) {
        this.mistral = mistral;
    }

    /**
     * Analyze a text to check if the context is respected
     * Also check for inappropriate language and illegal seeds/plants
     * @param description the text to analyze
     * @return the response from the LLM
     */
    protected String analyzeText(String description) {
        return mistral.generateTextAnalysis(description);
    }

    /**
     * Extracts the reasoning from the LLM response (everything before the TRUE/FALSE line)
     * @param llmResponse the full LLM response
     * @return the reasoning part of the response
     */
    String extractReasoning(String llmResponse) {
        if (llmResponse == null) return "";

        String[] lines = llmResponse.split("\\r?\\n"); // split by line
        if (lines.length == 0) return "";

        // everything except the last line
        return String.join(" ", java.util.Arrays.copyOf(lines, lines.length - 1)).trim();
    }

    /**
     * Extracts the verdict (TRUE or FALSE) from the LLM response
     * @param llmResponse the full LLM response
     * @return true if verdict is TRUE, false if FALSE
     */
    boolean extractVerdictText(String llmResponse) {
        if (llmResponse == null) return false;

        String[] lines = llmResponse.split("\\r?\\n");
        if (lines.length == 0) return false;

        String verdictLine = lines[lines.length - 1].trim();
        return "TRUE".equalsIgnoreCase(verdictLine);
    }
}
