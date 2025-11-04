package com.bg.usermicroservice.repository;

import com.bg.usermicroservice.entity.ClientReview;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ClientReviewRepository extends JpaRepository<ClientReview, String> {
    List<ClientReview> findAllBySellerId(String clientId);
}
