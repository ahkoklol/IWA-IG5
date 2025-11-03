package com.bg.reportingmicroservice.repository;

import com.bg.reportingmicroservice.entity.Request;
import org.springframework.data.jpa.repository.JpaRepository;

public interface RequestRepository extends JpaRepository<Request,String> {
}
