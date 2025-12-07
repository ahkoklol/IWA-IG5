package com.bg.reportingmicroservice.service;

import com.bg.reportingmicroservice.entity.Report;
import com.bg.reportingmicroservice.grpc.ReportRequest;
import com.bg.reportingmicroservice.grpc.ReportResponse;
import io.grpc.Status;
import io.grpc.StatusRuntimeException;
import io.grpc.stub.StreamObserver;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.grpc.server.service.GrpcService;

@GrpcService
public class ReportingServiceImpl {

    private static final Logger log = LoggerFactory.getLogger(ReportingServiceImpl.class);

    private final ReportService reportService;

    public ReportingServiceImpl(ReportService reportService) {
        this.reportService = reportService;
    }

    public void report(ReportRequest reportRequest, StreamObserver<ReportResponse> responseObserver) {
        log.info("Received report request for postId: {}", reportRequest.getPostId());

        try {
            Report report = new Report();
            report.setDescription(reportRequest.getDescription());
            report.setPostId(reportRequest.getPostId());
            report.setClientId(reportRequest.getClientId());

            reportService.report(reportRequest.getPostId(), report);

            ReportResponse response = ReportResponse.newBuilder()
                    .setMessage("Post with id " + reportRequest.getPostId() + "reported")
                    .build();

            log.info("Successfully reported post {}.", report.getPostId());
            responseObserver.onNext(response);
            responseObserver.onCompleted();
        } catch (StatusRuntimeException e) {
            responseObserver.onError(e);
        } catch (Exception e) {
            log.error("Error processing report request for postId: {}", reportRequest.getPostId(), e);
            responseObserver.onError(Status.INTERNAL
                    .withDescription("Internal error retrieving post: " + e.getMessage())
                    .withCause(e)
                    .asRuntimeException());
        }
    }

}
