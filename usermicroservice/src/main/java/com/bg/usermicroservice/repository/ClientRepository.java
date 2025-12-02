package com.bg.usermicroservice.repository;

import com.bg.usermicroservice.entity.Client;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ClientRepository extends JpaRepository<Client, String> {
}
