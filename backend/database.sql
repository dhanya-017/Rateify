-- Create database
CREATE DATABASE rating_platform;

-- Connect to the database
\c rating_platform;

-- Create Users table
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(60) NOT NULL CHECK (LENGTH(name) >= 20 AND LENGTH(name) <= 60),
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    address VARCHAR(400),
    role VARCHAR(20) NOT NULL CHECK (role IN ('ADMIN', 'USER', 'OWNER')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create Stores table
CREATE TABLE stores (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    address VARCHAR(400) NOT NULL,
    owner_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create Ratings table
CREATE TABLE ratings (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    store_id INTEGER NOT NULL REFERENCES stores(id) ON DELETE CASCADE,
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, store_id)
);

-- Create indexes for better performance
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_stores_email ON stores(email);
CREATE INDEX idx_ratings_user_id ON ratings(user_id);
CREATE INDEX idx_ratings_store_id ON ratings(store_id);

-- Insert sample admin user (password: Admin@123)
INSERT INTO users (name, email, password, address, role) VALUES 
('System Administrator User', 'admin@rating.com', '$2b$10$rQ8K8Z8Z8Z8Z8Z8Z8Z8Z8O8Z8Z8Z8Z8Z8Z8Z8Z8Z8Z8Z8Z8Z8Z8Z8Z8Z8', '123 Administrator Street, City, State 12345', 'ADMIN');

-- Insert sample stores
INSERT INTO stores (name, email, address) VALUES 
('Tech Store Electronics', 'tech@store.com', '123 Technology Boulevard, Silicon Valley, CA 94025'),
('Fashion Hub Boutique', 'fashion@hub.com', '456 Fashion Avenue, New York, NY 10001'),
('Food Corner Restaurant', 'food@corner.com', '789 Culinary Lane, Chicago, IL 60601');

-- Insert sample store owners
INSERT INTO users (name, email, password, address, role) VALUES 
('Tech Store Owner Manager', 'techowner@store.com', '$2b$10$rQ8K8Z8Z8Z8Z8Z8Z8Z8Z8O8Z8Z8Z8Z8Z8Z8Z8Z8Z8Z8Z8Z8Z8Z8Z8Z8Z8', '123 Technology Boulevard, Silicon Valley, CA 94025', 'OWNER'),
('Fashion Hub Owner Manager', 'fashionowner@hub.com', '$2b$10$rQ8K8Z8Z8Z8Z8Z8Z8Z8Z8O8Z8Z8Z8Z8Z8Z8Z8Z8Z8Z8Z8Z8Z8Z8Z8Z8Z8', '456 Fashion Avenue, New York, NY 10001', 'OWNER'),
('Food Corner Owner Manager', 'foodowner@corner.com', '$2b$10$rQ8K8Z8Z8Z8Z8Z8Z8Z8Z8O8Z8Z8Z8Z8Z8Z8Z8Z8Z8Z8Z8Z8Z8Z8Z8Z8Z8', '789 Culinary Lane, Chicago, IL 60601', 'OWNER');

-- Update stores with owner IDs
UPDATE stores SET owner_id = (SELECT id FROM users WHERE email = 'techowner@store.com') WHERE email = 'tech@store.com';
UPDATE stores SET owner_id = (SELECT id FROM users WHERE email = 'fashionowner@hub.com') WHERE email = 'fashion@hub.com';
UPDATE stores SET owner_id = (SELECT id FROM users WHERE email = 'foodowner@corner.com') WHERE email = 'food@corner.com';

-- Insert sample normal users
INSERT INTO users (name, email, password, address, role) VALUES 
('Johnathan Doe Smith Junior', 'john@example.com', '$2b$10$rQ8K8Z8Z8Z8Z8Z8Z8Z8Z8O8Z8Z8Z8Z8Z8Z8Z8Z8Z8Z8Z8Z8Z8Z8Z8Z8Z8', '123 Main Street, Anytown, USA 12345', 'USER'),
('Janet Marie Johnson Williams', 'jane@example.com', '$2b$10$rQ8K8Z8Z8Z8Z8Z8Z8Z8Z8O8Z8Z8Z8Z8Z8Z8Z8Z8Z8Z8Z8Z8Z8Z8Z8Z8Z8', '456 Oak Avenue, Smalltown, USA 67890', 'USER');

-- Insert sample ratings
INSERT INTO ratings (user_id, store_id, rating) VALUES 
((SELECT id FROM users WHERE email = 'john@example.com'), (SELECT id FROM stores WHERE email = 'tech@store.com'), 5),
((SELECT id FROM users WHERE email = 'john@example.com'), (SELECT id FROM stores WHERE email = 'fashion@hub.com'), 4),
((SELECT id FROM users WHERE email = 'jane@example.com'), (SELECT id FROM stores WHERE email = 'tech@store.com'), 4),
((SELECT id FROM users WHERE email = 'jane@example.com'), (SELECT id FROM stores WHERE email = 'food@corner.com'), 3);
