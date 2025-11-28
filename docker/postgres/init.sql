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
    category_id VARCHAR(100) NOT NULL,
    season VARCHAR(50),
    edible BOOLEAN,
    flowering_season VARCHAR(100),
    harvest_date VARCHAR(50),
    price DOUBLE PRECISION,
    status VARCHAR(50),
    client_id VARCHAR(100),
    FOREIGN KEY (category_id) REFERENCES category (category_id)
);

INSERT INTO post (
    post_id,
    date_created,
    date_modified,
    description,
    photos,
    weight,
    quantity,
    category_id,
    season,
    edible,
    flowering_season,
    harvest_date,
    price,
    status,
    client_id
) VALUES (
             '1',
             '2025-11-15 09:30:00Z',
             '2025-11-15 09:30:00Z',
             'Graines de figuier de barbarie (Opuntia ficus-indica) issues de fruits mûrs. Idéales pour créer une haie de cactus résistante à la sécheresse et produire des fruits juteux et sucrés. Convient particulièrement aux régions chaudes et ensoleillées.',
             'https://i.pinimg.com/1200x/cd/3f/f7/cd3ff7da347bc7705fd9f4d51a064344.jpg,https://i.pinimg.com/736x/38/f9/ab/38f9ab2de002f69dd6272d28b6663851.jpg,https://i.etsystatic.com/10534964/r/il/3c0b4c/6826956176/il_570xN.6826956176_p6he.jpg,https://ethnoplants.com/3984-medium_default/opuntia-ficus-indica-figue-barbarie-graines.jpg',
             NULL, -- weight is missing
             "30 graines", -- wrong -> devrait etre 30
             'Fruits',
             'Mars-Juin',
             TRUE,
             'Juin-Août',
             'Septembre 2025',
             4.50, -- parsed from '4,50 €'
             'SOLD', -- based on sold: true
             '1' -- client_id for 'mercottemamie'
         );

CREATE TABLE IF NOT EXISTS favourite (
    client_id VARCHAR(100) NOT NULL,
    post_id VARCHAR(100) NOT NULL,
    date TIMESTAMP NOT NULL,
    PRIMARY KEY (client_id, post_id),
    FOREIGN KEY (post_id) REFERENCES post (post_id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS category (
    category_id VARCHAR(100) PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
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

INSERT INTO transaction (
    transaction_id,
    date,
    status,
    commission,
    stripe_commission,
    total,
    payment_method_id,
    stripe_payment_intent_id,
    client_id,
    post_id
) VALUES (
          1,
          x,
          'completed',
          NULL,
          NULL,
          NULL,
          'card',
          'id',
          '2',
          '1'
         )

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
    date_of_birth DATE NOT NULL,
    user_id VARCHAR(255),
    photo_id VARCHAR(255)
);

INSERT INTO client (
    client_id,
    address,
    nationality,
    phone,
    photo,
    stripe_id,
    date_modified,
    date_of_birth,
    user_id,
    photo_id
) VALUES
      (
          '1',
          NULL,
          'Nationalité Française',
          NULL,
          'https://images.unsplash.com/photo-1711060266355-19214d0a15d7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxlbGRlcmx5JTIwd29tYW4lMjBwb3J0cmFpdHxlbnwxfHx8fDE3NTkzNTE3MDh8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
          NULL,
          CURRENT_TIMESTAMP,
          '1945-01-01',
          '1',
          NULL
      ),
      (
          '1',
          'Hérault, France',
          'Française',
          0611111111,
          'https://images.unsplash.com/photo-1711060266355-19214d0a15d7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxlbGRlcmx5JTIwd29tYW4lMjBwb3J0cmFpdHxlbnwxfHx8fDE3NTkzNTE3MDh8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
          'stripe_id',
          CURRENT_TIMESTAMP,
          '1945-01-01',
          '1',
          NULL
      ),

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

INSERT INTO notification (
    notification_id,
    message,
    type,
    is_read,
    date,
    client_id
) VALUES
    (
     1,
     NULL,
     'removed',
     false,
     NULL,
     1
    )

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