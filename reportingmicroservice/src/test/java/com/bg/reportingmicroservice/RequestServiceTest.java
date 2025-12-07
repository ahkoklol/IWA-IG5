package com.bg.reportingmicroservice;

import com.bg.reportingmicroservice.entity.Request;
import com.bg.reportingmicroservice.repository.RequestRepository;
import com.bg.reportingmicroservice.service.RequestService;
import jakarta.transaction.Transactional;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;

import java.util.Date;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertThrows;

@Transactional
public class RequestServiceTest extends PostgresTestcontainer {

    @Autowired
    private RequestRepository requestRepository;

    @Autowired
    private RequestService requestService;

    private Request defaultRequest;

    @BeforeEach
    void setup() {
        Request request =  new Request();
        request.setRequestId("requestid");
        request.setDate(new Date());
        request.setDescription("description");
        request.setPostId("postid");
        this.defaultRequest = requestRepository.save(request);
    }

    @Test
    void testCreateRequest_Success() {
        Request request = new Request();
        request.setRequestId("testrequestid");
        request.setDate(new Date());
        request.setDescription("testdescription");
        request.setPostId("testpostid");

        Request createdRequest = requestService.request("testpostid", request);

        assertThat(createdRequest).isNotNull();

        Optional<Request> createdRequestResult = requestService.getRequest("testpostid");

        assertThat(createdRequestResult).isPresent();
        assertThat(createdRequestResult.get()).isEqualTo(createdRequest);
        assertThat(createdRequestResult.get().getDescription()).isEqualTo("testdescription");
    }

    @Test
    void testCreateRequest_Throws_IllegalArgumentException() {
        Request request = new Request();
        request.setRequestId("testrequestid");
        request.setDate(new Date());
        request.setDescription("testdescription");
        request.setPostId("testpostid");

        assertThrows(IllegalArgumentException.class, () -> requestService.request("fakepostid", request));
    }

    @Test
    void testGetRequest_Success() {
        Optional<Request> result = requestService.getRequest(defaultRequest.getPostId());

        assertThat(result).isPresent();
        assertThat(result.get().getDescription()).isEqualTo(defaultRequest.getDescription());
    }

    @Test
    void testGetRequest_Throws_IllegalStateException() {
        Optional<Request> result = requestService.getRequest("wrongpostid");
        assertThat(result).isNotPresent();
    }

    @Test
    void testDeleteRequest_Success() {
        requestService.deleteRequest(defaultRequest.getPostId());

        assertThat(requestService.getRequest(defaultRequest.getPostId())).isEmpty();
    }

    @Test
    void testDeleteRequest_Throws_IllegalStateException() {
        assertThrows(
                IllegalArgumentException.class,
                () -> requestService.deleteRequest("fakerequestid")
        );
    }
}
