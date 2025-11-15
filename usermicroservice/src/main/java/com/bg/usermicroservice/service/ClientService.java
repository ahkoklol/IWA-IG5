package com.bg.usermicroservice.service;

import com.bg.usermicroservice.client.ListingClient;
import com.bg.usermicroservice.controller.UserController;
import com.bg.usermicroservice.entity.Client;
import com.bg.usermicroservice.entity.ClientReview;
import com.bg.usermicroservice.entity.ClientReviewDTO;
import com.bg.usermicroservice.entity.ClientReviewId;
import com.bg.usermicroservice.repository.ClientRepository;
import com.bg.usermicroservice.repository.ClientReviewRepository;
import com.bondgraine.listingmicroservice.grpc.GetPostRequest;
import com.bondgraine.listingmicroservice.grpc.GetPostResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class ClientService {

    private static final Logger log = LoggerFactory.getLogger(UserController.class);

    private final ClientRepository clientRepository;
    private final ClientReviewRepository clientReviewRepository;
    private final ListingClient listingClient;

    public ClientService(ClientRepository clientRepository, ClientReviewRepository clientReviewRepository, ListingClient listingClient) {
        this.clientRepository = clientRepository;
        this.clientReviewRepository = clientReviewRepository;
        this.listingClient = listingClient;
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
        boolean updated = applyClientUpdates(existingClient.get(), client);

        if (updated) {
            // 2. Only save and update dateModified if at least one field changed
            existingClient.get().setDateModified(new Date());
            clientRepository.save(existingClient.get());
            log.info("Client with id {} has been updated", clientId);
        } else {
            log.info("Client with id {} found, but no fields were updated", clientId);
        }
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
        log.info("Client with id {} has been deleted", clientId);
    }

    /**
     * Fetch all reviews for a seller
     * @param sellerId the seller id
     * @return a list of ClientReviewDTO objects
     */
    public List<ClientReviewDTO> getSellerReviews(String sellerId) {
        Optional<Client> existingClient = getClient(sellerId);
        if (existingClient.isEmpty()) {
            log.error("Seller with id {} does not exist", sellerId);
            throw new IllegalArgumentException("Client with id " + sellerId + " does not exist");
        }

        List<ClientReview> clientReviews = clientReviewRepository.findAllBySellerId(sellerId);

        return mapToClientReviewDTO(clientReviews);
    }

    /**
     * Helper method to map a list of ClientReview to a list of ClientReviewDTO
     * @param clientReviews a list of ClinetReview objects
     * @return a list of ClientReviewDTO
     */
    public List<ClientReviewDTO> mapToClientReviewDTO(List<ClientReview> clientReviews) {
        // Check for null or empty list to avoid errors
        if (clientReviews == null || clientReviews.isEmpty()) {
            return List.of(); // Return an empty list for a clean result
        }

        return clientReviews.stream()
                .map(this::mapToClientReviewDTO)
                .collect(Collectors.toList());
    }

    /**
     * Helper method to map a single ClientReview to ClientReviewDTO
     * @param clientReview a ClientReview object
     * @return a ClientReviewDTO
     */
    private ClientReviewDTO mapToClientReviewDTO(ClientReview clientReview) {
        ClientReviewDTO dto = new ClientReviewDTO();

        dto.setRating(clientReview.getRating());
        dto.setComment(clientReview.getComment());
        dto.setDateCreated(clientReview.getDateCreated());
        dto.setDateModified(clientReview.getDateModified());
        dto.setSellerId(clientReview.getSellerId());

        if (clientReview.getClientReviewId() != null) {
            dto.setBuyerId(clientReview.getClientReviewId().getBuyerId());
            dto.setPostId(clientReview.getClientReviewId().getPostId());
        }

        return dto;
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

        // Check that post exists using gRPC and throws if not found
        GetPostRequest getPostRequest = GetPostRequest.newBuilder()
                .setPostId(clientReviewDTO.getPostId())
                .build();

        // Attempt to get the post, wrapping the call in a try-catch for validation
        try {
            listingClient.getPost(getPostRequest);
            log.info("Post with id {} successfully verified.", clientReviewDTO.getPostId());
        } catch (io.grpc.StatusRuntimeException e) {
            if (e.getStatus().getCode() == io.grpc.Status.Code.NOT_FOUND) {
                log.error("Post with id {} not found for review.", clientReviewDTO.getPostId());
                throw new IllegalArgumentException("Post with id " + clientReviewDTO.getPostId() + " not found.");
            } else {
                log.error("gRPC call failed for post {}. Status: {}. Message: {}",
                        clientReviewDTO.getPostId(), e.getStatus().getCode(), e.getMessage());
                throw new RuntimeException("Failed to verify post existence due to service error.", e);
            }
        }

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

        log.info("Review created for seller {}",  sellerId);
        return clientReviewDTO;
    }

    /**
     * Add a profile picture for the user
     * @param clientId the client id
     * @param photo the photo
     */
    public void addPhoto(String clientId, MultipartFile photo) {
        Optional<Client> existingClient = getClient(clientId);
        if (existingClient.isEmpty()) {
            log.error("Client with id {} does not exist", clientId);
            throw new IllegalArgumentException("Client with id " + clientId + " does not exist");
        }

        // send bytes to media by grpc

        // save the photo name in Client object

        log.info("Added photo for client {}", clientId);
    }

    /**
     * Helper method to compare Client fields and apply updates
     * @param existingClient the client from the database
     * @param newClientData the data of the client to update
     * @return true if a field was updated, false otherwise
     */
    boolean applyClientUpdates(Client existingClient, Client newClientData) {
        boolean updated = false;

        if (!Objects.equals(newClientData.getAddress(), existingClient.getAddress())) {
            existingClient.setAddress(newClientData.getAddress());
            updated = true;
        }

        if (!Objects.equals(newClientData.getNationality(), existingClient.getNationality())) {
            existingClient.setNationality(newClientData.getNationality());
            updated = true;
        }

        if (!Objects.equals(newClientData.getPhone(), existingClient.getPhone())) {
            existingClient.setPhone(newClientData.getPhone());
            updated = true;
        }

        if (!Objects.equals(newClientData.getPhoto(), existingClient.getPhoto())) {
            existingClient.setPhoto(newClientData.getPhoto());
            updated = true;
        }

        // Assuming dateOfBirth is an updatable field
        if (!Objects.equals(newClientData.getDateOfBirth(), existingClient.getDateOfBirth())) {
            existingClient.setDateOfBirth(newClientData.getDateOfBirth());
            updated = true;
        }

        return updated;
    }
}
