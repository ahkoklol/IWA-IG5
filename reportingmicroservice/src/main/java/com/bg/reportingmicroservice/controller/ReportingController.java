package com.bg.reportingmicroservice.controller;

import com.bg.reportingmicroservice.entity.Report;
import com.bg.reportingmicroservice.entity.Request;
import com.bg.reportingmicroservice.service.ReportService;
import com.bg.reportingmicroservice.service.RequestService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/reporting")
public class ReportingController {

    private static final Logger log = LoggerFactory.getLogger(ReportingController.class);

    private final ReportService reportService;
    private final RequestService requestService;

    public ReportingController(ReportService reportService, RequestService requestService) {
        this.reportService = reportService;
        this.requestService = requestService;
    }

    @PostMapping("/report/{postId}")
    public ResponseEntity<Void> report(@PathVariable("postId") String postId, @RequestBody Report report) {
        reportService.report(report);
        return new ResponseEntity<>(HttpStatus.OK);
    }

    @GetMapping("/report/{postId}")
    public ResponseEntity<Report> getReport(@PathVariable("postId") String postId) {
        return reportService.getReport(postId)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/report/{postId}")
    public ResponseEntity<Void> deleteReport(@PathVariable("postId") String postId) {
        reportService.deleteReport(postId);
        return new ResponseEntity<>(HttpStatus.OK);
    }

    @PostMapping("/request/{postId}")
    public ResponseEntity<Void> request(@PathVariable("postId") String postId, @RequestBody Request request) {
        requestService.request(request);
        return new ResponseEntity<>(HttpStatus.OK);
    }

    @GetMapping("/request/{postId}")
    public ResponseEntity<Request> getRequest(@PathVariable("postId") String postId) {
        return requestService.getRequest(postId)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/request/{postId}")
    public ResponseEntity<Void> deleteRequest(@PathVariable("postId") String postId) {
        reportService.deleteReport(postId);
        return new ResponseEntity<>(HttpStatus.OK);
    }

}
