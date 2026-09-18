-- Smart Farmer Procurement & Queue Management Platform
-- PostgreSQL Database Schema

CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(120) UNIQUE,
    mobile VARCHAR(20) UNIQUE NOT NULL,
    hashed_password VARCHAR(255) NOT NULL,
    role VARCHAR(20) NOT NULL DEFAULT 'farmer',
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_users_mobile ON users(mobile);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);

CREATE TABLE IF NOT EXISTS centres (
    id SERIAL PRIMARY KEY,
    code VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(150) NOT NULL,
    state VARCHAR(100) NOT NULL,
    district VARCHAR(100) NOT NULL,
    address TEXT NOT NULL,
    latitude DOUBLE PRECISION,
    longitude DOUBLE PRECISION,
    opening_time VARCHAR(10) NOT NULL DEFAULT '08:00 AM',
    closing_time VARCHAR(10) NOT NULL DEFAULT '05:00 PM',
    contact_phone VARCHAR(20),
    commodities VARCHAR(255) NOT NULL DEFAULT 'Wheat, Paddy, Mustard, Gram',
    daily_capacity INT NOT NULL DEFAULT 50,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS farmers (
    id SERIAL PRIMARY KEY,
    user_id INT UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    farmer_id VARCHAR(50) UNIQUE NOT NULL,
    full_name VARCHAR(100) NOT NULL,
    mobile VARCHAR(20) NOT NULL,
    address TEXT NOT NULL,
    district VARCHAR(100),
    state VARCHAR(100),
    preferred_language VARCHAR(10) NOT NULL DEFAULT 'en',
    created_at TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_farmers_farmer_id ON farmers(farmer_id);

CREATE TABLE IF NOT EXISTS staff (
    id SERIAL PRIMARY KEY,
    user_id INT UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    staff_code VARCHAR(50) UNIQUE NOT NULL,
    full_name VARCHAR(100) NOT NULL,
    designation VARCHAR(100) NOT NULL DEFAULT 'Procurement Officer',
    centre_id INT REFERENCES centres(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS slots (
    id SERIAL PRIMARY KEY,
    centre_id INT NOT NULL REFERENCES centres(id) ON DELETE CASCADE,
    slot_date DATE NOT NULL,
    start_time VARCHAR(20) NOT NULL,
    end_time VARCHAR(20) NOT NULL,
    capacity INT NOT NULL DEFAULT 10,
    booked_count INT NOT NULL DEFAULT 0,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT uq_centre_slot_time UNIQUE (centre_id, slot_date, start_time, end_time)
);

CREATE INDEX IF NOT EXISTS idx_slots_centre_date ON slots(centre_id, slot_date);

CREATE TABLE IF NOT EXISTS bookings (
    id SERIAL PRIMARY KEY,
    booking_number VARCHAR(50) UNIQUE NOT NULL,
    farmer_id INT NOT NULL REFERENCES farmers(id) ON DELETE CASCADE,
    centre_id INT NOT NULL REFERENCES centres(id) ON DELETE CASCADE,
    slot_id INT NOT NULL REFERENCES slots(id) ON DELETE RESTRICT,
    booking_date DATE NOT NULL,
    token_number INT NOT NULL,
    token_display VARCHAR(20) NOT NULL,
    crop_type VARCHAR(100) NOT NULL DEFAULT 'Wheat',
    estimated_quantity_quintals DOUBLE PRECISION NOT NULL DEFAULT 10.0,
    status VARCHAR(20) NOT NULL DEFAULT 'booked',
    created_at TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT uq_centre_date_token UNIQUE (centre_id, booking_date, token_number)
);

CREATE INDEX IF NOT EXISTS idx_bookings_centre_date ON bookings(centre_id, booking_date);
CREATE INDEX IF NOT EXISTS idx_bookings_farmer ON bookings(farmer_id);

CREATE TABLE IF NOT EXISTS queue_entries (
    id SERIAL PRIMARY KEY,
    booking_id INT UNIQUE NOT NULL REFERENCES bookings(id) ON DELETE CASCADE,
    centre_id INT NOT NULL REFERENCES centres(id) ON DELETE CASCADE,
    token_number INT NOT NULL,
    queue_date DATE NOT NULL,
    position INT NOT NULL DEFAULT 1,
    status VARCHAR(20) NOT NULL DEFAULT 'waiting',
    check_in_time TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    called_time TIMESTAMP WITHOUT TIME ZONE,
    serving_start_time TIMESTAMP WITHOUT TIME ZONE,
    completed_time TIMESTAMP WITHOUT TIME ZONE,
    created_at TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_queue_centre_date_status ON queue_entries(centre_id, queue_date, status);

CREATE TABLE IF NOT EXISTS procurements (
    id SERIAL PRIMARY KEY,
    booking_id INT UNIQUE NOT NULL REFERENCES bookings(id) ON DELETE CASCADE,
    centre_id INT NOT NULL REFERENCES centres(id) ON DELETE CASCADE,
    farmer_id INT NOT NULL REFERENCES farmers(id) ON DELETE CASCADE,
    staff_id INT REFERENCES staff(id) ON DELETE SET NULL,
    receipt_number VARCHAR(50) UNIQUE NOT NULL,
    crop_name VARCHAR(100) NOT NULL,
    variety VARCHAR(100),
    grade VARCHAR(50) NOT NULL DEFAULT 'Grade A',
    moisture_percentage DOUBLE PRECISION NOT NULL DEFAULT 12.0,
    quantity_quintals DOUBLE PRECISION NOT NULL,
    msp_rate_per_quintal DOUBLE PRECISION NOT NULL,
    total_amount DOUBLE PRECISION NOT NULL,
    procurement_date TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    remarks TEXT,
    created_at TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS payments (
    id SERIAL PRIMARY KEY,
    procurement_id INT UNIQUE NOT NULL REFERENCES procurements(id) ON DELETE CASCADE,
    farmer_id INT NOT NULL REFERENCES farmers(id) ON DELETE CASCADE,
    amount DOUBLE PRECISION NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'pending',
    transaction_id VARCHAR(100) UNIQUE,
    payment_method VARCHAR(50) NOT NULL DEFAULT 'Direct Benefit Transfer (DBT)',
    payment_date TIMESTAMP WITHOUT TIME ZONE,
    bank_name VARCHAR(100) DEFAULT 'State Bank of India',
    account_last4 VARCHAR(10) DEFAULT '9012',
    remarks TEXT,
    created_at TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_payments_farmer ON payments(farmer_id);
CREATE INDEX IF NOT EXISTS idx_payments_status ON payments(status);

CREATE TABLE IF NOT EXISTS notifications (
    id SERIAL PRIMARY KEY,
    user_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(150) NOT NULL,
    message TEXT NOT NULL,
    type VARCHAR(50) NOT NULL DEFAULT 'info',
    is_read BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_notifications_user ON notifications(user_id, is_read);
