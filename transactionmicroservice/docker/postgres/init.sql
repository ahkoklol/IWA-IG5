CREATE TABLE transaction (
                             transaction_id VARCHAR(255) PRIMARY KEY,
                             date DATE NOT NULL DEFAULT CURRENT_DATE,
                             status VARCHAR(50) NOT NULL,
                             commission DOUBLE PRECISION NOT NULL,
                             stripe_commission DOUBLE PRECISION NOT NULL,
                             clientId VARCHAR(255) NOT NULL,
                             postId VARCHAR(255) NOT NULL
);

INSERT INTO transaction (transaction_id, date, status, commission, stripe_commission, clientId, postId) VALUES
    ('TXN-987654321', CURRENT_DATE, 'COMPLETED', 1.50, 0.45, 'CLIENT-A', 'POST-101');

INSERT INTO transaction (transaction_id, date, status, commission, stripe_commission, clientId, postId) VALUES
    ('TXN-123456789', CURRENT_DATE, 'PENDING', 2.00, 0.60, 'CLIENT-B', 'POST-102');

INSERT INTO transaction (transaction_id, date, status, commission, stripe_commission, clientId, postId) VALUES
    ('TXN-555555555', CURRENT_DATE, 'FAILED', 0.00, 0.00, 'CLIENT-C', 'POST-103');