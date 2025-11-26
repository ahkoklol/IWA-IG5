package com.bondgraine.listingmicroservice.service;

import com.bondgraine.listingmicroservice.entity.Category;
import com.bondgraine.listingmicroservice.repository.CategoryRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.List;

public class CategoryService {

    private static final Logger log = LoggerFactory.getLogger(CategoryService.class);

    private final CategoryRepository categoryRepository;

    public CategoryService(CategoryRepository categoryRepository) {
        this.categoryRepository = categoryRepository;
    }

    public List<Category> getCategories() {
        return this.categoryRepository.findAll();
    }

}
