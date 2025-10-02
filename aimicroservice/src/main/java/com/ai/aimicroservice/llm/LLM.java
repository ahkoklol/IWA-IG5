package com.ai.aimicroservice.llm;

public interface LLM {

    /**
     * Analyse the text for compliance check
     * No inappropriate words, illegal plants/seeds, or unrelated to the seed selling context
     * @param text the text to analyse
     * @return the response of the analysis with TRUE or FALSE at the end
     */
    String generateTextAnalysis(String text);
}
