-- 1. Create roles table
CREATE TABLE roles (
    id SERIAL PRIMARY KEY, 
    role_name VARCHAR(50) UNIQUE NOT NULL
);
SELECT * FROM roles;

-- 2. Create users table
CREATE TABLE users (
    id SERIAL PRIMARY KEY, 
    name VARCHAR(100) NOT NULL, 
    password_hash VARCHAR(255) NOT NULL,
    role_id INT REFERENCES roles(id)
);
SELECT * FROM users;

-- 3. Contacts table
CREATE TABLE contacts (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(id) ON DELETE CASCADE UNIQUE,
    email VARCHAR(150) UNIQUE NOT NULL,
    phone VARCHAR(20),
    address TEXT
);
SELECT * FROM contacts;

-- 4. Session table
CREATE TABLE sessions (
    id VARCHAR(255) PRIMARY KEY,
    user_id INT REFERENCES users(id) ON DELETE CASCADE NOT NULL,
    expires_at TIMESTAMP NOT NULL
);
SELECT * FROM sessions;

-- 5. Assets table
CREATE TABLE assets (
    id SERIAL PRIMARY KEY, 
    name VARCHAR(150) NOT NULL,
    description TEXT,
    current_owner_id INT REFERENCES users(id) ON DELETE SET NULL
);
SELECT * FROM assets;

-- 6. Asset assignments table
CREATE TABLE asset_assignments (
    id SERIAL PRIMARY KEY, 
    asset_id INT REFERENCES assets(id) ON DELETE CASCADE NOT NULL,
    assigned_by INT REFERENCES users(id) ON DELETE SET NULL,
    assigned_to INT REFERENCES users(id) ON DELETE SET NULL,
    assigned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    returned_at TIMESTAMP
);
SELECT * FROM asset_assignments;

-- 7. Audit logs table
CREATE TABLE audit_logs (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(id) ON DELETE SET NULL,
    action VARCHAR(100) NOT NULL,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
SELECT * FROM audit_logs;

-- 1. Insert Dummy Users (Password is 'password123' for all)
-- The crazy string is the bcrypt hash for 'password123'
INSERT INTO users (name, email, password_hash, role_id, phone) VALUES
('Alice Admin', 'alice@company.com', '$2a$12$W9yG04v0d6Q/Wk7m.B8uOORc5d7Q2i9s.Rj7X8zT1mN.oP8q3M7gO', 1, '555-0101'),
('Bob Auditor', 'bob@company.com', '$2a$12$W9yG04v0d6Q/Wk7m.B8uOORc5d7Q2i9s.Rj7X8zT1mN.oP8q3M7gO', 2, '555-0102'),
('Charlie Tech', 'charlie@company.com', '$2a$12$W9yG04v0d6Q/Wk7m.B8uOORc5d7Q2i9s.Rj7X8zT1mN.oP8q3M7gO', 3, '555-0103'),
('Diana Employee', 'diana@company.com', '$2a$12$W9yG04v0d6Q/Wk7m.B8uOORc5d7Q2i9s.Rj7X8zT1mN.oP8q3M7gO', 4, '555-0104'),
('Evan NewGuy', 'evan@company.com', '$2a$12$W9yG04v0d6Q/Wk7m.B8uOORc5d7Q2i9s.Rj7X8zT1mN.oP8q3M7gO', 5, '555-0105');

-- 2. Insert Dummy Assets
INSERT INTO assets (name, description, current_owner_id, status) VALUES
('MacBook Pro M3', 'Engineering Dept - Primary', (SELECT id FROM users WHERE email='diana@company.com'), 'Assigned'),
('Dell XPS 15', 'Finance Dept', (SELECT id FROM users WHERE email='bob@company.com'), 'Assigned'),
('Production Server Alpha', 'Main PostgreSQL DB', (SELECT id FROM users WHERE email='alice@company.com'), 'Assigned'),
('Cisco Catalyst Switch', 'Lobby Network Room', NULL, 'Available'),
('ThinkPad T14', 'Spare Laptop', NULL, 'Available');

-- 3. Insert Dummy Audit Logs (Creating the "Threats")
INSERT INTO audit_logs (asset_id, user_id, action_details, severity, status, logged_at) VALUES
((SELECT id FROM assets WHERE name='Production Server Alpha'), (SELECT id FROM users WHERE email='alice@company.com'), 'Multiple failed root login attempts detected originating from external IP.', 'high', 'open', CURRENT_TIMESTAMP - INTERVAL '1 day'),
((SELECT id FROM assets WHERE name='MacBook Pro M3'), (SELECT id FROM users WHERE email='diana@company.com'), 'Unauthorized VPN installation blocked.', 'medium', 'open', CURRENT_TIMESTAMP - INTERVAL '2 hours'),
((SELECT id FROM assets WHERE name='Dell XPS 15'), (SELECT id FROM users WHERE email='bob@company.com'), 'Routine antivirus signature update successful.', 'low', 'resolved', CURRENT_TIMESTAMP - INTERVAL '1 week');