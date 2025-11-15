package com.bg.usermicroservice.service;

import com.bg.usermicroservice.entity.Client;
import com.bg.usermicroservice.grpc.GetUserRequest;
import com.bg.usermicroservice.grpc.GetUserResponse;
import io.grpc.Status;
import io.grpc.StatusRuntimeException;
import io.grpc.stub.StreamObserver;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.grpc.server.service.GrpcService;

import java.util.Optional;

@GrpcService
public class UserServiceImpl {

    private static final Logger log = LoggerFactory.getLogger(UserServiceImpl.class);

    private final ClientService clientService;

    public UserServiceImpl(ClientService clientService) {
        this.clientService = clientService;
    }

    public void getUser(GetUserRequest request, StreamObserver<GetUserResponse> responseObserver) {
        log.info("Received getUser request for userId: {}", request.getUserId());

        try {
            Optional<Client> optionalClient = clientService.getClient(request.getUserId());
            if (optionalClient.isEmpty()) {
                log.error("User {} not found.", request.getUserId());
                responseObserver.onError(Status.NOT_FOUND
                        .withDescription("User not found with ID: " + request.getUserId())
                        .asRuntimeException());
                return;
            }
            Client client = optionalClient.get();

            GetUserResponse response = GetUserResponse.newBuilder()
                    .setPhone(client.getPhone())
                    .setUserId(client.getUserId())
                    .setStripeId(client.getStripeId())
                    .build();

            log.info("Successfully retrieved post {}.", request.getUserId());
            responseObserver.onNext(response);
            responseObserver.onCompleted();
        } catch (StatusRuntimeException e) {
            responseObserver.onError(e);
        } catch (Exception e) {
            log.error("Error processing getPost request for postId: {}", request.getUserId(), e);
            responseObserver.onError(Status.INTERNAL
                    .withDescription("Internal error retrieving post: " + e.getMessage())
                    .withCause(e)
                    .asRuntimeException());
        }
    }
}
