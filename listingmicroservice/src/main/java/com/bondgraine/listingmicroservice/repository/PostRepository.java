package com.bondgraine.listingmicroservice.repository;

import com.bondgraine.listingmicroservice.entity.Post;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface PostRepository extends JpaRepository<Post, String> {

    /**
     * Finds all Posts for a client with status.
     * Generated query: WHERE client_id = ? AND status = 'x'
     */
    List<Post> findByClientIdAndStatus(String clientId, String status);

    List<Post> findByCategory(String category);
}