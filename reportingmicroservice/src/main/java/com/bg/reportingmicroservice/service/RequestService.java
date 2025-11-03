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
     */
    public void request(Request request) {
        request.setRequestId(UUID.randomUUID().toString());
        request.setType(request.getType());
        request.setDate(new Date());
        request.setDescription(request.getDescription());
        request.setPostId(request.getPostId());

        requestRepository.save(request);
    }

    /**
     * Fetch a request by id
     * @param requestId the id of the request
     * @return a request object or null
     */
    public Optional<Request> getRequest(String requestId) {
        return requestRepository.findById(requestId);
    }

    /**
     * Delete a request
     * @param requestId id of the request
     */
    public void deleteRequest(String requestId) {
        Optional<Request> request = requestRepository.findById(requestId);
        if (request.isEmpty()) {
            log.error("request with id {} not found", requestId);
            throw new IllegalStateException("request with id " + requestId + " not found");
        }
        requestRepository.deleteById(requestId);
    }
}
