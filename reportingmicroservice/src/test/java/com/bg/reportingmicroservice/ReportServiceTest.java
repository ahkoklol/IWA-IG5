package com.bg.reportingmicroservice;

import com.bg.reportingmicroservice.entity.Report;
import com.bg.reportingmicroservice.repository.ReportRepository;
import com.bg.reportingmicroservice.service.ReportService;
import jakarta.transaction.Transactional;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;

import java.util.Date;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertThrows;

@Transactional
public class ReportServiceTest extends PostgresTestcontainer {

    @Autowired
    private ReportRepository reportRepository;

    @Autowired
    private ReportService reportService;

    private Report defaultReport;

    @BeforeEach
    void setup() {
        Report report =  new Report();
        report.setReportId("reportid");
        report.setType("report");
        report.setDate(new Date());
        report.setClientId("clientid");
        report.setDescription("description");
        report.setPostId("postid");
        this.defaultReport = reportRepository.save(report);
    }

    @Test
    void testCreateReport_Success() {
        Report report = new Report();
        report.setReportId("testreportid");
        report.setType("testreport");
        report.setDate(new Date());
        report.setClientId("testclientid");
        report.setDescription("testdescription");
        report.setPostId("testpostid");

        Report createdReport = reportService.report("testpostid", report);

        assertThat(createdReport).isNotNull();

        Optional<Report> createdReportResult = reportService.getReport("testpostid");

        assertThat(createdReportResult).isPresent();
        assertThat(createdReportResult.get()).isEqualTo(createdReport);
        assertThat(createdReportResult.get().getClientId()).isEqualTo("testclientid");
    }

    @Test
    void testCreateReport_Throws_IllegalArgumentException() {
        Report report = new Report();
        report.setReportId("testreportid");
        report.setType("testreport");
        report.setDate(new Date());
        report.setClientId("testclientid");
        report.setDescription("testdescription");
        report.setPostId("testpostid");

        assertThrows(IllegalArgumentException.class, () -> reportService.report("fakepostid", report));
    }

    @Test
    void testGetReport_Success() {
        Optional<Report> result = reportService.getReport(defaultReport.getPostId());

        assertThat(result).isPresent();
        assertThat(result.get().getClientId()).isEqualTo(defaultReport.getClientId());
    }

    @Test
    void testGetReport_Throws_IllegalStateException() {
        Optional<Report> result = reportService.getReport("wrongpostid");
        assertThat(result).isNotPresent();
    }

    @Test
    void testDeleteReport_Success() {
        reportService.deleteReport(defaultReport.getPostId());

        assertThat(reportService.getReport(defaultReport.getPostId())).isEmpty();
    }

    @Test
    void testDeleteReport_Throws_IllegalStateException() {
        assertThrows(
                IllegalArgumentException.class,
                () -> reportService.deleteReport("fakepostid")
        );
    }

}
