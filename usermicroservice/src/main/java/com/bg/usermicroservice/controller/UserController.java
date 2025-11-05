package com.bg.usermicroservice.controller;

import com.bg.usermicroservice.entity.Client;
import com.bg.usermicroservice.entity.ClientReview;
import com.bg.usermicroservice.entity.ClientReviewDTO;
import com.bg.usermicroservice.service.ClientService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/user")
public class UserController {

    private static final Logger log = LoggerFactory.getLogger(UserController.class);

    private final ClientService clientService;

    public UserController(ClientService clientService) {
        this.clientService = clientService;
    }

    @GetMapping("/{clientId}")
    public ResponseEntity<Client> getClient(@PathVariable String clientId) {
        log.info("Fetching client with id {}", clientId);
        return clientService.getClient(clientId)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping("/register")
    public ResponseEntity<Client> registerClient(@RequestBody Client client) {
        Client clientResponse = clientService.createClient(client);
        if (clientResponse == null) {
            log.info("Client could not be created");
            return ResponseEntity.badRequest().build();
        }
        log.info("Client registered");
        return ResponseEntity.ok(clientResponse);
    }

    @PutMapping("/{clientId}")
    public ResponseEntity<Void> updateClient(@PathVariable String clientId, @RequestBody Client client) {
        clientService.updateClient(clientId, client);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/{clientId}")
    public ResponseEntity<Void> deleteClient(@PathVariable String clientId) {
        clientService.deleteClient(clientId);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/{clientId}/reviews")
    public ResponseEntity<List<ClientReviewDTO>> getReviews(@PathVariable String clientId) {
        List<ClientReviewDTO> clientReviews = clientService.getSellerReviews(clientId);
        if (clientReviews.isEmpty()) {
            log.info("No reviews found for client with id {}", clientId);
            return ResponseEntity.ok(clientReviews);
        }

    }

    @PostMapping("/{clientId}/review")
    public ResponseEntity<ClientReviewDTO> review(@PathVariable String clientId, @RequestBody ClientReviewDTO clientReviewDTO) {}

    @PostMapping("/{clientId}/photo")
    public ResponseEntity<Void> addPhoto(@PathVariable String clientId, @RequestParam("photo") MultipartFile photo) {}

}
