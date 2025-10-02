package com.ai.aimicroservice.entity;

import java.util.Date;

public class Report {

    private String description;
    private String type;
    private Date date;

    public Report() {
    }

    public Report(String description, String type, Date date) {
        this.description = description;
        this.type = type;
        this.date = date;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public Date getDate() {
        return date;
    }

    public void setDate(Date date) {
        this.date = date;
    }

    @Override
    public String toString() {
        return "Report{" +
                "description='" + description + '\'' +
                ", type='" + type + '\'' +
                ", date=" + date +
                '}';
    }
}
