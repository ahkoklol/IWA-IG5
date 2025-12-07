package com.bg.usermicroservice.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.io.Serializable;

@Embeddable
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ClientReviewId implements Serializable {

    @Column(name = "buyer_id")
    private String buyerId;

    @Column(name = "post_id")
    private String postId;
}