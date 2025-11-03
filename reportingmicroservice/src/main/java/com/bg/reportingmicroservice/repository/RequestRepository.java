package com.bg.reportingmicroservice.repository;

import com.bg.reportingmicroservice.entity.Request;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface RequestRepository extends JpaRepository<Request,String> {
    Optional<Request> findByRequestId(String postId);
}
