CREATE TABLE IF NOT EXISTS post (
    post_id VARCHAR(100) PRIMARY KEY,
    date_created DATE NOT NULL DEFAULT CURRENT_DATE,
    date_modified DATE,
    description VARCHAR(500),
    photos TEXT[],
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

CREATE TABLE IF NOT EXISTS favourite (
    -- Primary Key components (Composite Key)
    client_id VARCHAR(100) NOT NULL,
    post_id VARCHAR(100) NOT NULL,

    -- Additional Field
    date TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,

    -- Define the Composite Primary Key
    PRIMARY KEY (client_id, post_id),

    -- Define Foreign Key to the local 'post' table
    -- This enforces data integrity for local posts
    FOREIGN KEY (post_id) REFERENCES post (post_id) ON DELETE CASCADE
);

INSERT INTO post (
    post_id, date_created, date_modified, description, photos, weight, quantity, type,
    season, edible, flowering_season, harvest_date, price, status, client_id
) VALUES
      (
          'post001',
          CURRENT_DATE,
          NULL,
          'Fresh organic tomatoes from our local farm',
          ARRAY['photo1.jpg', 'photo2.jpg'],
          1.5,
          10,
          'Vegetable',
          'Summer',
          TRUE,
          'June-July',
          '2025-07-15',
          12.99,
          'Available',
          'client001'
      ),
      (
          'post002',
          CURRENT_DATE,
          NULL,
          'Handmade wooden chairs',
          ARRAY['chair1.png', 'chair2.png'],
          7.0,
          5,
          'Furniture',
          'All Seasons',
          FALSE,
          NULL,
          NULL,
          79.99,
          'Available',
          'client002'
      );
