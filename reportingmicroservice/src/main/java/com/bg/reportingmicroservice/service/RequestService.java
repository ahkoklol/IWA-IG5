package com.bg.reportingmicroservice.service;

import com.bg.reportingmicroservice.entity.Request;
import com.bg.reportingmicroservice.repository.RequestRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.util.Date;
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
    public Request request(Request request) {
        request.setRequestId(UUID.randomUUID().toString());
        request.setType(request.getType());
        request.setDate(new Date());
        request.setDescription(request.getDescription());
        request.setPostId(request.getPostId());

        return requestRepository.save(request);
    }

    /**
     * Fetch a request by id
     * @param postId the id of the post
     * @return a request object or null
     */
    public Optional<Request> getRequest(String postId) {
        return requestRepository.findByRequestId(postId);
    }

    /**
     * Delete a request
     * @param postId id of the post
     */
    public void deleteRequest(String postId) {
        Optional<Request> request = requestRepository.findById(postId);
        if (request.isEmpty()) {
            log.error("request with id {} not found", postId);
            throw new IllegalStateException("request with id " + postId + " not found");
        }
        requestRepository.deleteById(postId);
    }
}
