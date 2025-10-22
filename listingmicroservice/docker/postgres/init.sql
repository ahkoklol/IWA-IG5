CREATE TABLE IF NOT EXISTS post (
    postId VARCHAR(100) PRIMARY KEY,
    dateCreated DATE NOT NULL DEFAULT CURRENT_DATE,
    dateModified DATE,
    description VARCHAR(500),
    photos TEXT,
    weight DOUBLE PRECISION,
    quantity INT,
    type VARCHAR(100),
    season VARCHAR(50),
    edible BOOLEAN,
    floweringSeason VARCHAR(100),
    harvestDate DATE,
    price DOUBLE PRECISION,
    status VARCHAR(50),
    clientId VARCHAR(100)
    );

CREATE TABLE IF NOT EXISTS favourite (
    -- Primary Key components (Composite Key)
    clientId VARCHAR(100) NOT NULL,
    postId VARCHAR(100) NOT NULL,

    -- Additional Field
    date TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,

    -- Define the Composite Primary Key
    PRIMARY KEY (clientId, postId),

    -- Define Foreign Key to the local 'post' table
    -- This enforces data integrity for local posts
    FOREIGN KEY (postId) REFERENCES post (postId) ON DELETE CASCADE
);

INSERT INTO post (
    "postId", "dateCreated", "dateModified", "description", "photos", "weight", "quantity", "type",
    "season", "edible", "floweringSeason", "harvestDate", "price", "status", "clientId"
) VALUES
      (
          'post001',
          CURRENT_DATE,
          CURRENT_DATE,
          'Fresh organic tomatoes from our local farm',
          'photo1.jpg,photo2.jpg',
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
          CURRENT_DATE,
          'Handmade wooden chairs',
          'chair1.png,chair2.png',
          7.0,
          5,
          'Furniture',
          'All Seasons',
          FALSE,
          June-July,
          '2025-07-15',
          79.99,
          'Available',
          'client002'
      );