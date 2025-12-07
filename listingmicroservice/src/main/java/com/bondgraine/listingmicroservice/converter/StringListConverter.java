package com.bondgraine.listingmicroservice.converter;

import jakarta.persistence.AttributeConverter;
import jakarta.persistence.Converter;

import java.util.Arrays;
import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

@Converter
public class StringListConverter implements AttributeConverter<List<String>, String> {

    private static final String SEPARATOR = ",";

    // Converts the List<String> (Java object) into a single String (Database column)
    @Override
    public String convertToDatabaseColumn(List<String> stringList) {
        if (stringList == null || stringList.isEmpty()) {
            return null;
        }
        return stringList.stream()
                .map(String::trim)
                .collect(Collectors.joining(SEPARATOR));
    }

    // Converts the single String (Database column) back into a List<String> (Java object)
    @Override
    public List<String> convertToEntityAttribute(String dbData) {
        System.out.println(">>> StringListConverter received data: [" + dbData + "]");
        if (dbData == null || dbData.trim().isEmpty()) {
            return Collections.emptyList();
        }
        try {
            List<String> result = Arrays.stream(dbData.split(SEPARATOR))
                    .map(String::trim)
                    .filter(s -> !s.isEmpty())
                    .collect(Collectors.toList());
            System.out.println(">>> StringListConverter SUCCESS. Result size: " + result.size());
            return result;
        } catch (Exception e) {
            e.printStackTrace();
            return Collections.emptyList();
        }
    }
}