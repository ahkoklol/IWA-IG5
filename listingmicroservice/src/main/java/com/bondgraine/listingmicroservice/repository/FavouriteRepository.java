package com.bondgraine.listingmicroservice.repository;

import com.bondgraine.listingmicroservice.entity.Favourite;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface FavouriteRepository extends JpaRepository<Favourite, String> {

    boolean existsByIdPostIdAndIdClientId(String postId, String clientId);
    List<Favourite> findById_PostId(String idPostId);
}