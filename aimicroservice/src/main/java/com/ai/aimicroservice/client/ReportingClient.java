package com.ai.aimicroservice.client;

import com.bg.reportingmicroservice.grpc.ReportRequest;
import com.bg.reportingmicroservice.grpc.ReportResponse;
import com.bg.reportingmicroservice.grpc.ReportingServiceGrpc.ReportingServiceBlockingStub;
import org.springframework.stereotype.Service;

@Service
public class ReportingClient {

    private ReportingServiceBlockingStub reportingClientStub;

    public ReportingClient(ReportingServiceBlockingStub reportingClientStub) {
        this.reportingClientStub = reportingClientStub;
    }

    public ReportResponse report(ReportRequest reportRequest) {
        return reportingClientStub.reportPost(reportRequest);
    }
}
