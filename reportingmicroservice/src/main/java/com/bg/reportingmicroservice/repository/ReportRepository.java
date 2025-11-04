package com.bg.reportingmicroservice.repository;

import com.bg.reportingmicroservice.entity.Report;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface ReportRepository extends JpaRepository<Report,String> {
    Optional<Report> findByPostId(String postId);
    void deleteByPostId(String postId);
}
