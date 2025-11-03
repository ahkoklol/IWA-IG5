package com.bg.reportingmicroservice.service;

import com.bg.reportingmicroservice.entity.Report;
import com.bg.reportingmicroservice.repository.ReportRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.util.Date;
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
     */
    public void report(Report report) {
        report.setReportId(UUID.randomUUID().toString());
        report.setType(report.getType());
        report.setDate(new Date());
        report.setDescription(report.getDescription());
        report.setClientId(report.getClientId());
        report.setPostId(report.getPostId());

        reportRepository.save(report);
    }

    /**
     * Fetch a report by id
     * @param reportId the id of the report
     * @return a Report object or null
     */
    public Optional<Report> getReport(String reportId) {
        return reportRepository.findById(reportId);
    }

    /**
     * Delete a report
     * @param reportId id of the report
     */
    public void deleteReport(String reportId) {
        Optional<Report> report = reportRepository.findById(reportId);
        if (report.isEmpty()) {
            log.error("Report with id {} not found", reportId);
            throw new IllegalStateException("Report with id " + reportId + " not found");
        }
        reportRepository.deleteById(reportId);
    }
}
