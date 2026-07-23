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