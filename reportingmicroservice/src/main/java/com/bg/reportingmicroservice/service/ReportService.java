package com.bg.reportingmicroservice.service;

import com.bg.reportingmicroservice.entity.Report;
import com.bg.reportingmicroservice.repository.ReportRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.Objects;
import java.util.Optional;
import java.util.UUID;

@Service
public class ReportService {

    private static final Logger log = LoggerFactory.getLogger(ReportService.class);

    private final ReportRepository reportRepository;

    public ReportService(ReportRepository reportRepository) {
        this.reportRepository = reportRepository;
    }

    /**
     * Report a post
     * @param report a Report object
     * @return a Report object
     */
    public Report report(String postId, Report report) {

        // check that postId and report.postId match
        if (!Objects.equals(postId, report.getPostId())) {
            log.warn("Post id mismatch");
            throw new IllegalArgumentException("Post id mismatch");
        }

        report.setReportId(UUID.randomUUID().toString());
        report.setType(report.getType());
        report.setDate(new Date());
        report.setDescription(report.getDescription());
        report.setClientId(report.getClientId());
        report.setPostId(report.getPostId());

        return reportRepository.save(report);
    }

    /**
     * Fetch a report by id
     * @param postId the id of the post
     * @return a Report object or null
     */
    public Optional<Report> getReport(String postId) {
        return reportRepository.findByPostId(postId);
    }

    /**
     * Delete a report
     * @param postId id of the post
     */
    public void deleteReport(String postId) {
        Optional<Report> report = getReport(postId);
        if (report.isEmpty()) {
            log.error("Report with id {} not found", postId);
            throw new IllegalArgumentException("Report with id " + postId + " not found");
        }
        reportRepository.deleteByPostId(postId);
        log.info("Report with id {} deleted", postId);
    }
}
