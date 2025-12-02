package com.micro.media.entity;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;

/**
 * DTO of the result brought by AI analysis.
 * TODO: Adapt to the real results
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Getter
public class AiResultDTO {

    private boolean valid;
    private double confidence;
    private String description;
}
