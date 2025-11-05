package com.bg.usermicroservice;

import com.bg.usermicroservice.entity.Client;
import com.bg.usermicroservice.entity.ClientReview;
import com.bg.usermicroservice.entity.ClientReviewDTO;
import com.bg.usermicroservice.entity.ClientReviewId;
import com.bg.usermicroservice.repository.ClientRepository;
import com.bg.usermicroservice.repository.ClientReviewRepository;
import com.bg.usermicroservice.service.ClientService;
import jakarta.persistence.Column;
import jakarta.transaction.Transactional;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;

import java.util.Date;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertThrows;

@Transactional
public class ClientServiceTest extends PostgresTestcontainer {

    @Autowired
    private ClientService clientService;

    @Autowired
    private ClientRepository clientRepository;

    @Autowired
    private ClientReviewRepository clientReviewRepository;

    private Client defaultClient;
    private ClientReview defaultClientReview;

    private Client createBaseClient() {
        Client client = new Client();
        client.setClientId("clientid");
        client.setAddress("address");
        client.setNationality("nationality");
        client.setPhone("phone");
        client.setPhoto("photo");
        Date date = new Date();
        client.setDateModified(date);
        client.setDateOfBirth(date);
        client.setUserId("userid");
        client.setPhotoId("photoid");
        return client;
    }

    private ClientReview createBaseClientReview() {
        ClientReview clientReview = new ClientReview();
        ClientReviewId clientReviewId = new ClientReviewId();
        clientReviewId.setBuyerId("buyerid");
        clientReviewId.setPostId("postid");
        clientReview.setClientReviewId(clientReviewId);
        clientReview.setRating(5);
        clientReview.setComment("comment");
        clientReview.setSellerId("sellerid");
        Date date = new Date();
        clientReview.setDateCreated(date);
        clientReview.setDateModified(date);
        return clientReview;
    }

    @BeforeEach
    void setup() {
        Client client = createBaseClient();
        clientRepository.save(client);
        this.defaultClient = client;

        ClientReview clientReview = createBaseClientReview();
        clientReviewRepository.save(clientReview);
        this.defaultClientReview = clientReview;
    }

    @Test
    void testGetClient_Success() {
        Optional<Client> client = clientService.getClient("clientid");

        assertThat(client.isPresent()).isTrue();
    }

    @Test
    void testGetClient_Fail() {
        Optional<Client> client = clientService.getClient("fakeclientid");

        assertThat(client.isPresent()).isFalse();
    }

    @Test
    void testCreateClient_Success() {
        Client client = createBaseClient();
        client.setClientId("testclientid");
        Client createdClient = clientService.createClient(client);

        assertThat(createdClient).isNotNull();
        assertThat(createdClient.getClientId()).isEqualTo("testclientid");
    }

    @Test
    void testUpdateClient_Success() {
        Client client = createBaseClient();
        client.setPhone("newphone");
        clientService.updateClient("clientid", client);
        Optional<Client> clientResult = clientService.getClient("clientid");

        assertThat(clientResult.isPresent()).isTrue();
        assertThat(clientResult.get().getPhone()).isEqualTo("newphone");
    }

    @Test
    void testUpdateClient_NothingToUpdate() {
        Client client = createBaseClient();
        clientService.updateClient("clientid", client);
        Optional<Client> clientResult = clientService.getClient("clientid");

        assertThat(clientResult.isPresent()).isTrue();
        assertThat(clientResult.get().getPhone()).isEqualTo("phone");
    }

    @Test
    void testUpdateClient_Failure() {
        Client client = createBaseClient();
        client.setPhone("newphone");

        assertThrows(
                IllegalArgumentException.class,
                () -> clientService.updateClient("fakeclientid", client)
        );
    }

    @Test
    void testDeleteClient_Success() {
        clientService.deleteClient("clientid");
        Optional<Client> client = clientService.getClient("clientid");

        assertThat(client.isPresent()).isFalse();
    }

    @Test
    void testDeleteClient_Fail() {
        clientService.deleteClient("fakeclientid");
        Optional<Client> client = clientService.getClient("clientid");

        assertThat(client.isPresent()).isTrue();
    }

    @Test
    void testGetSellerReviews() {
        List<ClientReviewDTO> clientReviews = clientService.getSellerReviews("clientid");

        assertThat(clientReviews).isNotNull();
        assertThat(clientReviews.size()).isEqualTo(1);
        assertThat(clientReviews.getFirst().getBuyerId()).isEqualTo("buyerid");
    }

    @Test
    void testGetSellerReviews_Failure() {
        assertThrows(
                IllegalArgumentException.class,
                () -> clientService.getSellerReviews("fakeclientid")
        );
    }
}
