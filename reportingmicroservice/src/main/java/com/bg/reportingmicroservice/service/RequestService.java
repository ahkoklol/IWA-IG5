package com.bg.reportingmicroservice.service;

import com.bg.reportingmicroservice.entity.Request;
import com.bg.reportingmicroservice.repository.RequestRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.Objects;
import java.util.Optional;
import java.util.UUID;

@Service
public class RequestService {

    private static final Logger log = LoggerFactory.getLogger(RequestService.class);

    private final RequestRepository requestRepository;

    public RequestService(RequestRepository requestRepository) {
        this.requestRepository = requestRepository;
    }

    /**
     * request a post
     * @param request a request object
     * @return a Request object
     */
    public Request request(String postId, Request request) {

        // check that postId and report.postId match
        if (!Objects.equals(postId, request.getPostId())) {
            log.warn("Post id mismatch");
            throw new IllegalArgumentException("Post id mismatch");
        }

        request.setRequestId(UUID.randomUUID().toString());
        request.setDate(new Date());

        return requestRepository.save(request);
    }

    /**
     * Fetch a request by id
     * @param postId the id of the post
     * @return a request object or null
     */
    public Optional<Request> getRequest(String postId) {
        return requestRepository.findByPostId(postId);
    }

    /**
     * Delete a request
     * @param postId id of the post
     */
    public void deleteRequest(String postId) {
        Optional<Request> request = getRequest(postId);
        if (request.isEmpty()) {
            log.error("Request with id {} not found", postId);
            throw new IllegalArgumentException("Request with id " + postId + " not found");
        }
        requestRepository.deleteByPostId(postId);
        log.info("Request with id {} deleted", postId);
    }
}
