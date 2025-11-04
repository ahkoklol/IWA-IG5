package com.bg.usermicroservice.controller;

import com.bg.usermicroservice.entity.Client;
import com.bg.usermicroservice.entity.ClientReview;
import com.bg.usermicroservice.entity.ClientReviewDTO;
import com.bg.usermicroservice.service.ClientService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/user")
public class UserController {

    private static final Logger log = LoggerFactory.getLogger(UserController.class);

    private final ClientService clientService;

    public UserController(ClientService clientService) {
        this.clientService = clientService;
    }

    @GetMapping("/{clientId}")
    public ResponseEntity<Client> getClient(@PathVariable String clientId) {}

    @PostMapping("/register")
    public ResponseEntity<Client> registerClient(@RequestBody Client client) {}

    @PutMapping("/{clientId}")
    public ResponseEntity<Void> updateClient(@PathVariable String clientId, @RequestBody Client client) {}

    @DeleteMapping("/{clientId}")
    public ResponseEntity<Void> deleteClient(@PathVariable String clientId) {}

    @GetMapping("/{clientId}/reviews")
    public ResponseEntity<List<ClientReviewDTO>> getReviews(@PathVariable String clientId) {}

    @PostMapping("/{clientId}/review")
    public ResponseEntity<ClientReviewDTO> review(@PathVariable String clientId, @RequestBody ClientReviewDTO clientReviewDTO) {}

    @PostMapping("/{clientId}/photo")
    public ResponseEntity<Void> addPhoto(@PathVariable String clientId, @RequestParam("photo") MultipartFile photo) {}

}
