package com.bg.transactionmicroservice.entity;

import jakarta.persistence.Column;
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
    @Column(name = "transaction_id")
    private String transactionId;
    private Date date;
    private String status;
    private double commission;

    @Column(name = "stripe_commission")
    private double stripeCommission;

    @Column(name = "payment_method_id")
    private String paymentMethodId;

    @Column(name = "stripe_payment_intent_id")
    private String stripePaymentIntentId;

    @Column(name = "client_id")
    private String clientId; // buyer id

    @Column(name = "post_id")
    private String postId;
    private double total;
}