package com.bg.usermicroservice.service;

import com.bg.usermicroservice.controller.UserController;
import com.bg.usermicroservice.entity.Client;
import com.bg.usermicroservice.entity.ClientReview;
import com.bg.usermicroservice.entity.ClientReviewDTO;
import com.bg.usermicroservice.entity.ClientReviewId;
import com.bg.usermicroservice.repository.ClientRepository;
import com.bg.usermicroservice.repository.ClientReviewRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.util.*;

@Service
public class ClientService {

    private static final Logger log = LoggerFactory.getLogger(UserController.class);

    private final ClientRepository clientRepository;
    private final ClientReviewRepository clientReviewRepository;

    public ClientService(ClientRepository clientRepository, ClientReviewRepository clientReviewRepository) {
        this.clientRepository = clientRepository;
        this.clientReviewRepository = clientReviewRepository;
    }

    /**
     * Fetch a client by id
     * @param clientId the client id
     * @return a Client object
     */
    public Optional<Client> getClient(String clientId) {
        return clientRepository.findById(clientId);
    }

    /**
     * Creates a Client
     * @param client the client to create
     * @return the created Client object
     */
    public Client createClient(Client client) {
        client.setClientId(UUID.randomUUID().toString());
        client.setDateModified(new Date());
        return clientRepository.save(client);
    }

    /**
     * Update a Client details
     * @param clientId the id of the client
     * @param client the fields to update
     */
    public void updateClient(String clientId, Client client) {
        Optional<Client> existingClient = getClient(clientId);
        if (existingClient.isEmpty()) {
            log.error("Client with id {} does not exist", clientId);
            throw new IllegalArgumentException("Client with id " + clientId + " does not exist");
        }

        // check all fields and update

        existingClient.get().setDateModified(new Date());
        clientRepository.save(existingClient.get());
    }

    /**
     * Delete a client by id
     * @param clientId the id of the client
     */
    public void deleteClient(String clientId) {
        Optional<Client> existingClient = getClient(clientId);
        if (existingClient.isEmpty()) {
            log.error("Client with id {} does not exist", clientId);
            throw new IllegalArgumentException("Client with id " + clientId + " does not exist");
        }

        clientRepository.deleteById(clientId);
    }

    /**
     * Fetch all reviews for a seller
     * @param sellerId the seller id
     * @return a list of ClientReview objects
     */
    public List<ClientReview> getSellerReviews(String sellerId) {
        Optional<Client> existingClient = getClient(sellerId);
        if (existingClient.isEmpty()) {
            log.error("Client with id {} does not exist", sellerId);
            throw new IllegalArgumentException("Client with id " + sellerId + " does not exist");
        }

        return clientReviewRepository.findAllBySellerId(sellerId);
    }

    /**
     * Create a review for a seller
     * @param sellerId the seller id
     * @param clientReviewDTO a ClientReviewDTO with the info for a review
     * @return a ClientReviewDTO object
     */
    public ClientReviewDTO createSellerReview(String sellerId, ClientReviewDTO clientReviewDTO) {
        Optional<Client> existingSeller = getClient(sellerId);
        if (existingSeller.isEmpty()) {
            log.error("Client with id {} does not exist", sellerId);
            throw new IllegalArgumentException("Client with id " + sellerId + " does not exist");
        }

        Optional<Client> existingBuyer = getClient(clientReviewDTO.getBuyerId());
        if (existingBuyer.isEmpty()) {
            log.error("Client with id {} does not exist", clientReviewDTO.getBuyerId());
            throw new IllegalArgumentException("Client with id " + clientReviewDTO.getBuyerId() + " does not exist");
        }

        // check that post exists using grpc

        // map to client review and save to db
        ClientReview clientReview = new ClientReview();
        ClientReviewId clientReviewId = new ClientReviewId(clientReviewDTO.getBuyerId(), clientReviewDTO.getPostId());
        clientReview.setClientReviewId(clientReviewId);
        clientReview.setRating(clientReviewDTO.getRating());
        clientReview.setComment(clientReviewDTO.getComment());
        Date date = new Date();
        clientReview.setDateCreated(date);
        clientReview.setDateModified(date);
        clientReview.setSellerId(sellerId);
        clientReviewRepository.save(clientReview);

        // map and return the dto
        clientReviewDTO.setDateCreated(clientReview.getDateCreated());
        clientReviewDTO.setDateModified(clientReview.getDateModified());
        return clientReviewDTO;
    }

    /**
     * Add a profile picture for the user
     * @param clientId the client id
     * @param photo
     * @return
     */
    public Client addPhoto(String clientId, MultipartFile photo) {
        Optional<Client> existingClient = getClient(clientId);
        if (existingClient.isEmpty()) {
            log.error("Client with id {} does not exist", clientId);
            throw new IllegalArgumentException("Client with id " + clientId + " does not exist");
        }

        // send bytes to media by grpc

        // save the photo name in Client object

        // return the updated client
    }


}
