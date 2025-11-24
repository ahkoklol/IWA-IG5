package com.ai.aimicroservice.service;

import com.ai.aimicroservice.grpc.AnalyzeRequest;
import com.ai.aimicroservice.grpc.AnalyzeResponse;
import io.grpc.stub.StreamObserver;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.grpc.server.service.GrpcService;

import java.io.ByteArrayOutputStream;

@GrpcService
public class AiServiceImpl {

    private static final Logger log = LoggerFactory.getLogger(AiServiceImpl.class);

    private final AIAnalysisService aiAnalysisService;

    public AiServiceImpl(AIAnalysisService aiAnalysisService) {
        this.aiAnalysisService = aiAnalysisService;
    }

    public StreamObserver<AnalyzeRequest> analyze(StreamObserver<AnalyzeResponse> responseObserver) {
        log.info("Received analyze request");

        return new StreamObserver<AnalyzeRequest>() {

            private ByteArrayOutputStream buffer = new ByteArrayOutputStream();
            private String fileName;

            @Override
            public void onNext(AnalyzeRequest request) {
                if (fileName == null) fileName = request.getFileName();
                try {
                    buffer.write(request.getData().toByteArray());
                } catch (Exception e) {
                    responseObserver.onError(e);
                }
            }

            @Override
            public void onError(Throwable t) {
                log.error("Client cancelled or stream error", t);
            }

            @Override
            public void onCompleted() {
                try {
                    byte[] file = buffer.toByteArray();

                    String result = aiAnalysisService.analyze(postId, fileName, file);

                    AnalyzeResponse response = AnalyzeResponse.newBuilder()
                            .setFilename(fileName)
                            .setResponse(result)
                            .build();

                    responseObserver.onNext(response);
                    responseObserver.onCompleted();
                } catch (Exception e) {
                    responseObserver.onError(e);
                }
            }
        };

    }

}
