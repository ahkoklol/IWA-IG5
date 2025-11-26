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
    date_created TIMESTAMP NOT NULL,
    date_modified TIMESTAMP NOT NULL,
    description VARCHAR(500),
    photos TEXT,
    weight DOUBLE PRECISION,
    quantity INT,
    category VARCHAR(100),
    season VARCHAR(50),
    edible BOOLEAN,
    flowering_season VARCHAR(100),
    harvest_date DATE,
    price DOUBLE PRECISION,
    status VARCHAR(50),
    client_id VARCHAR(100)
);

CREATE TABLE IF NOT EXISTS favourite (
    client_id VARCHAR(100) NOT NULL,
    post_id VARCHAR(100) NOT NULL,
    date TIMESTAMP NOT NULL,
    PRIMARY KEY (client_id, post_id),
    FOREIGN KEY (post_id) REFERENCES post (post_id) ON DELETE CASCADE
);

-- 3. Setup 'transactionmicroservice'
\connect transactionmicroservice

CREATE TABLE IF NOT EXISTS transaction (
    transaction_id VARCHAR(255) PRIMARY KEY,
    date TIMESTAMP NOT NULL,
    status VARCHAR(50) NOT NULL,
    commission DOUBLE PRECISION NOT NULL,
    stripe_commission DOUBLE PRECISION NOT NULL,
    total DOUBLE PRECISION NOT NULL,
    payment_method_id VARCHAR(255),
    stripe_payment_intent_id VARCHAR(255),
    client_id VARCHAR(255) NOT NULL,
    post_id VARCHAR(255) NOT NULL
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
    date_modified TIMESTAMP NOT NULL,
    date_of_birth TIMESTAMP NOT NULL,
    user_id VARCHAR(255),
    photo_id VARCHAR(255)
);

CREATE TABLE client_review (
    buyer_id VARCHAR(255) NOT NULL,
    post_id VARCHAR(255) NOT NULL,
    rating INT NOT NULL,
    comment VARCHAR(1000),
    date_created TIMESTAMP NOT NULL,
    date_modified TIMESTAMP NOT NULL,
    seller_id VARCHAR(255),
    PRIMARY KEY (buyer_id, post_id),
    FOREIGN KEY (buyer_id) REFERENCES client (client_id),
    FOREIGN KEY (seller_id) REFERENCES client (client_id)
);

-- 5. Setup 'notificationmicroservice'
\connect notificationmicroservice

CREATE TABLE notification (
    notification_id VARCHAR(255) PRIMARY KEY,
    message TEXT,
    type VARCHAR(255),
    is_read BOOLEAN,
    date TIMESTAMP NOT NULL,
    client_id VARCHAR(255)
);

-- 6. Setup 'reportingmicroservice'
\connect reportingmicroservice

CREATE TABLE report (
    report_id VARCHAR(255) PRIMARY KEY,
    type VARCHAR(255),
    date TIMESTAMP NOT NULL,
    description TEXT,
    client_id VARCHAR(255),
    post_id VARCHAR(255)
);

CREATE TABLE request (
     request_id VARCHAR(255) PRIMARY KEY,
     type VARCHAR(255),
     date TIMESTAMP NOT NULL,
     description TEXT,
     post_id VARCHAR(255)
);