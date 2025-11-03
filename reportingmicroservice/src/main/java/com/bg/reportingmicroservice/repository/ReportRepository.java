package com.bg.reportingmicroservice.repository;

import com.bg.reportingmicroservice.entity.Report;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ReportRepository extends JpaRepository<Report,String> {
}
