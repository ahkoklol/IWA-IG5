package com.bondgraine.listingmicroservice.repository;

import com.bondgraine.listingmicroservice.entity.Favourite;
import org.springframework.data.jpa.repository.JpaRepository;

public interface FavouriteRepository extends JpaRepository<Favourite, String> {
    // Optional: add custom query methods if needed
}