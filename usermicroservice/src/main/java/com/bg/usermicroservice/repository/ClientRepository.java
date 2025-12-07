package com.bg.usermicroservice.repository;

import com.bg.usermicroservice.entity.Client;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface ClientRepository extends JpaRepository<Client, String> {


    Optional<Client> findFirstByUserId(String userId);

}
