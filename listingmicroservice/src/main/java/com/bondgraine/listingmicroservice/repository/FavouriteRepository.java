package com.bondgraine.listingmicroservice.repository;

import com.bondgraine.listingmicroservice.entity.Favourite;
import org.springframework.data.jpa.repository.JpaRepository;

public interface FavouriteRepository extends JpaRepository<Favourite, String> {

    /**
     * Spring Data JPA derived query to check if a favorite already exists
     * based on the two primary key components.
     * * @param postId The ID of the post.
     * @param clientId The ID of the client.
     * @return true if a matching composite key is found, false otherwise.
     */
    boolean existsByIdPostIdAndIdClientId(String postId, String clientId);
}