package com.ai.aimicroservice.service;

import com.ai.aimicroservice.llm.Mistral;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.when;

class TextAnalysisServiceTest {

    private Mistral mistral;
    private TextAnalysisService textAnalysisService;

    @BeforeEach
    void setUp() {
        // mock the LLM dependency
        mistral = Mockito.mock(Mistral.class);
        textAnalysisService = new TextAnalysisService(mistral);
    }

    @Test
    void testAnalyzeText() {
        // given
        String description = "Tomato seeds for sale";
        String fakeResponse = "This looks like a legal seed sale.\nTRUE";

        when(mistral.generateTextAnalysis(description)).thenReturn(fakeResponse);

        // when
        String response = textAnalysisService.analyzeText(description);

        // then
        assertNotNull(response);
        assertEquals(fakeResponse, response);
    }

    @Test
    void testExtractReasoning() {
        String llmResponse = "This text describes vegetables.\nTRUE";

        String reasoning = textAnalysisService.extractReasoning(llmResponse);

        assertEquals("This text describes vegetables.", reasoning);
    }

    @Test
    void testExtractReasoningWithMultipleLines() {
        String llmResponse = "Line one\nLine two\nFALSE";

        String reasoning = textAnalysisService.extractReasoning(llmResponse);

        assertEquals("Line one Line two", reasoning);
    }

    @Test
    void testExtractReasoningNullInput() {
        assertEquals("", textAnalysisService.extractReasoning(null));
    }

    @Test
    void testExtractVerdictTrue() {
        String llmResponse = "Reasoning here\nTRUE";

        assertTrue(textAnalysisService.extractVerdictText(llmResponse));
    }

    @Test
    void testExtractVerdictFalse() {
        String llmResponse = "Reasoning here\nFALSE";

        assertFalse(textAnalysisService.extractVerdictText(llmResponse));
    }

    @Test
    void testExtractVerdictNullInput() {
        assertFalse(textAnalysisService.extractVerdictText(null));
    }
}
