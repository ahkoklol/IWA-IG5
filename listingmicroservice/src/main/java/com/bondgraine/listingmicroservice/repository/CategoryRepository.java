package com.bondgraine.listingmicroservice.repository;

import com.bondgraine.listingmicroservice.entity.Category;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CategoryRepository extends JpaRepository<Category, String> {
}
