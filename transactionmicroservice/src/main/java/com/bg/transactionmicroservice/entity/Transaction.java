package com.bg.transactionmicroservice.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Data;

import java.util.Date;

@Data
@Entity
@Table(name = "transaction")
public class Transaction {

    @Id
    private String transactionId;
    private Date date;
    private String status;
    private double commission;
    private double stripeCommission;
    private String clientId; // buyer id
    private String postId;

}