package com.bondgraine.listingmicroservice;

import com.bondgraine.listingmicroservice.entity.Category;
import com.bondgraine.listingmicroservice.repository.CategoryRepository;
import com.bondgraine.listingmicroservice.service.CategoryService;
import jakarta.transaction.Transactional;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;

import java.util.List;
import static org.assertj.core.api.Assertions.assertThat;

@Transactional
public class CategoryServiceTest extends PostgresTestcontainer{

    @Autowired
    private CategoryService categoryService;

    @Autowired
    private CategoryRepository categoryRepository;

    private Category createBaseCategory(String categoryId, String name) {
        Category category = new Category();
        category.setCategoryId(categoryId);
        category.setName(name);
        categoryRepository.save(category);
        return category;
    }

    @BeforeEach
    public void setup() {
        createBaseCategory("vegetables", "Vegetables");
        createBaseCategory("fruits", "Fruits");
        createBaseCategory("aromatic_herbs_spices", "Aromatic herbs / Spices");
        createBaseCategory("medicinal_plants", "Medicinal plants");
        createBaseCategory("decorative_flowers", "Decorative flowers");
        createBaseCategory("exotic_rare_plants", "Exotic rare plants");
    }

    @Test
    void testGetAllCategories() {
        List<Category> categories = categoryService.getCategories();

        assertThat(categories).isNotNull();
        assertThat(categories.size()).isEqualTo(6);
        assertThat(categories.getFirst().getCategoryId()).isEqualTo("vegetables");
    }
}
