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
            private String postId;

            @Override
            public void onNext(AnalyzeRequest request) {
                if (fileName == null) {
                    fileName = request.getFileName();
                    postId = request.getPostId();
                }
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

                    if (postId == null || postId.isEmpty() || fileName == null || fileName.isEmpty()) {
                        responseObserver.onError(io.grpc.Status.INVALID_ARGUMENT
                                .withDescription("Metadata (postId/fileName) missing in the first chunk.")
                                .asRuntimeException());
                        return;
                    }

                    boolean result = aiAnalysisService.analyze(postId, fileName, file);
                    String responseMessage = result ? "Analyzed Successfully" : "Analyze Failed";

                    AnalyzeResponse response = AnalyzeResponse.newBuilder()
                            .setFilename(fileName)
                            .setResponse(responseMessage)
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
