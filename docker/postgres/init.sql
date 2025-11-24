-- 1. Create the specific databases for each microservice
CREATE DATABASE usermicroservice;
CREATE DATABASE listingmicroservice;
CREATE DATABASE transactionmicroservice;
CREATE DATABASE notificationmicroservice;
CREATE DATABASE reportingmicroservice;

-- 2. Setup 'listingmicroservice'
\connect listingmicroservice

CREATE TABLE IF NOT EXISTS post (
                                    post_id VARCHAR(100) PRIMARY KEY,
    date_created DATE NOT NULL DEFAULT CURRENT_DATE,
    date_modified DATE,
    description VARCHAR(500),
    photos TEXT,
    weight DOUBLE PRECISION,
    quantity INT,
    type VARCHAR(100),
    season VARCHAR(50),
    edible BOOLEAN,
    flowering_season VARCHAR(100),
    harvest_date DATE,
    price DOUBLE PRECISION,
    status VARCHAR(50),
    client_id VARCHAR(100)
    );

-- FIX APPLIED: Changed "REFERENCES post (postId)" to "REFERENCES post (post_id)"
CREATE TABLE IF NOT EXISTS favourite (
                                         clientId VARCHAR(100) NOT NULL,
    postId VARCHAR(100) NOT NULL,
    date TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (clientId, postId),
    FOREIGN KEY (postId) REFERENCES post (post_id) ON DELETE CASCADE
    );

-- 3. Setup 'transactionmicroservice'
\connect transactionmicroservice

CREATE TABLE transaction (
                             transaction_id VARCHAR(255) PRIMARY KEY,
                             date DATE NOT NULL DEFAULT CURRENT_DATE,
                             status VARCHAR(50) NOT NULL,
                             commission DOUBLE PRECISION NOT NULL,
                             stripe_commission DOUBLE PRECISION NOT NULL,
                             clientId VARCHAR(255) NOT NULL,
                             postId VARCHAR(255) NOT NULL
);

-- 4. Setup 'usermicroservice'
\connect usermicroservice

CREATE TABLE client (
                        client_id VARCHAR(255) PRIMARY KEY,
                        address VARCHAR(255),
                        nationality VARCHAR(255),
                        phone VARCHAR(255),
                        photo VARCHAR(255),
                        stripe_id VARCHAR(255),
                        date_modified TIMESTAMP,
                        date_of_birth TIMESTAMP,
                        user_id VARCHAR(255),
                        photoId VARCHAR(255)
);

CREATE TABLE client_review (
                               buyer_id VARCHAR(255) NOT NULL,
                               post_id VARCHAR(255) NOT NULL,
                               rating INT NOT NULL,
                               comment VARCHAR(1000),
                               date_created TIMESTAMP,
                               date_modified TIMESTAMP,
                               seller_id VARCHAR(255),
                               PRIMARY KEY (buyer_id, post_id)
);

-- 5. Setup 'notificationmicroservice'
\connect notificationmicroservice

CREATE TABLE notification (
                              notification_id VARCHAR(255) PRIMARY KEY,
                              message TEXT,
                              type VARCHAR(255),
                              isRead BOOLEAN,
                              date TIMESTAMP,
                              client_id VARCHAR(255)
);

-- 6. Setup 'reportingmicroservice'
\connect reportingmicroservice

CREATE TABLE report (
                        report_id VARCHAR(255) PRIMARY KEY,
                        type VARCHAR(255),
                        date TIMESTAMP,
                        description TEXT,
                        client_id VARCHAR(255),
                        post_id VARCHAR(255)
);

CREATE TABLE request (
                         request_id VARCHAR(255) PRIMARY KEY,
                         type VARCHAR(255),
                         date TIMESTAMP,
                         description TEXT,
                         post_id VARCHAR(255)
);