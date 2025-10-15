package com.bondgraine.listingmicroservice.repository;

import com.bondgraine.listingmicroservice.entity.Post;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PostRepository extends JpaRepository<Post, String> {
    // Optional: add custom query methods if needed
}