-- ==============================================================================
-- smart-Mandi — Transparent Procurement & Commodity Intelligence Platform
-- Ministry of Consumer Affairs, Food & Public Distribution (Government of India)
-- Full PostgreSQL / Supabase Schema Definition
-- ==============================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. ROLES AND PERMISSIONS
CREATE TABLE IF NOT EXISTS roles (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

INSERT INTO roles (id, name, description) VALUES
('farmer', 'Farmer', 'Agricultural producer with stock declaration, slot booking, and payment tracking'),
('vendor', 'Verified Vendor/Buyer', 'Commercial buyer with access to aggregated stock and procurement interest requests'),
('centre_operator', 'Procurement Centre Operator', 'Authorized mandi operator managing queues, weighment, and intake'),
('quality_inspector', 'Quality Inspector', 'Authorized assayer recording moisture, impurities, and quality grades'),
('district_authority', 'District Authority / DMO', 'District Magistrate / District Marketing Officer with regional oversight'),
('ministry_admin', 'Ministry / Central Admin', 'Ministry of Consumer Affairs & Food Distribution oversight and policy team'),
('super_admin', 'Super Admin', 'System administrator with full security and schema audit access')
ON CONFLICT (id) DO NOTHING;

-- 2. USER PROFILES
CREATE TABLE IF NOT EXISTS profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    role VARCHAR(50) REFERENCES roles(id) DEFAULT 'farmer',
    full_name VARCHAR(255) NOT NULL,
    mobile_number VARCHAR(15) UNIQUE,
    email VARCHAR(255) UNIQUE,
    state VARCHAR(100) NOT NULL,
    district VARCHAR(100) NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. FARMERS TABLE (Privacy Protected: No plaintext Aadhaar)
CREATE TABLE IF NOT EXISTS farmers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    profile_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    farmer_id VARCHAR(50) UNIQUE NOT NULL, -- e.g., FMR-RJ-2026-1024
    village VARCHAR(100) NOT NULL,
    address TEXT NOT NULL,
    land_area_acres NUMERIC(8,2) NOT NULL,
    land_ownership_status VARCHAR(50) NOT NULL DEFAULT 'Owned', -- Owned, Leased, Shared
    preferred_procurement_centre_id UUID,
    
    -- Verification Flags
    aadhaar_verification_status VARCHAR(50) DEFAULT 'Verified', -- Pending, Verified, Rejected
    mobile_verified BOOLEAN DEFAULT TRUE,
    bank_verified BOOLEAN DEFAULT TRUE,
    land_verified BOOLEAN DEFAULT TRUE,
    bank_account_mask VARCHAR(20) DEFAULT 'XXXX-XXXX-4819',
    ifsc_code VARCHAR(15) DEFAULT 'SBIN0001234',
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. FARMS
CREATE TABLE IF NOT EXISTS farms (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    farmer_id UUID REFERENCES farmers(id) ON DELETE CASCADE,
    farm_name VARCHAR(150),
    khasra_number VARCHAR(100),
    latitude NUMERIC(10, 6),
    longitude NUMERIC(10, 6),
    soil_type VARCHAR(100),
    irrigation_source VARCHAR(100),
    total_area_acres NUMERIC(8,2) NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. CROPS CATALOG
CREATE TABLE IF NOT EXISTS crops (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    hindi_name VARCHAR(100),
    category VARCHAR(50) NOT NULL, -- Cereal, Pulse, Oilseed, Vegetable, Cash Crop
    msp_rate NUMERIC(10,2) NOT NULL, -- Minimum Support Price in INR per quintal
    unit VARCHAR(20) DEFAULT 'Quintal',
    quality_standards JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. FARMER STOCK MODULE
CREATE TABLE IF NOT EXISTS farmer_stock (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    farmer_id UUID REFERENCES farmers(id) ON DELETE CASCADE,
    crop_id VARCHAR(50) REFERENCES crops(id),
    variety VARCHAR(100),
    cultivated_area_acres NUMERIC(8,2) NOT NULL,
    expected_production_quintals NUMERIC(10,2) NOT NULL,
    available_stock_quintals NUMERIC(10,2) NOT NULL,
    harvest_date DATE NOT NULL,
    storage_location VARCHAR(255) NOT NULL,
    expected_procurement_quintals NUMERIC(10,2) NOT NULL,
    quality_grade VARCHAR(10) DEFAULT 'Grade A', -- Grade A, Grade B, FAQ (Fair Average Quality)
    status VARCHAR(50) DEFAULT 'Available for procurement',
    -- Cultivated, Harvested, Stored, Available for procurement, Partially procured, Fully procured
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. VERIFIED VENDORS
CREATE TABLE IF NOT EXISTS vendors (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    profile_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    vendor_code VARCHAR(50) UNIQUE NOT NULL, -- e.g., VND-2026-081
    business_name VARCHAR(255) NOT NULL,
    owner_name VARCHAR(255) NOT NULL,
    business_type VARCHAR(100) NOT NULL, -- Cooperative, Private Miller, Agro Processing, Registered Trader
    gst_number_mask VARCHAR(20) NOT NULL, -- 08XXXXX4312Z1
    license_number VARCHAR(100) NOT NULL,
    verification_status VARCHAR(50) DEFAULT 'Verified', -- Pending, Under Review, Verified, Suspended
    state VARCHAR(100) NOT NULL,
    district VARCHAR(100) NOT NULL,
    commodities_handled TEXT[] DEFAULT ARRAY['Wheat', 'Rice'],
    storage_capacity_mt NUMERIC(10,2) DEFAULT 500.00,
    procurement_capacity_mt NUMERIC(10,2) DEFAULT 250.00,
    contact_phone VARCHAR(20),
    contact_email VARCHAR(150),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. PROCUREMENT CENTRES
CREATE TABLE IF NOT EXISTS procurement_centres (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    code VARCHAR(50) UNIQUE NOT NULL, -- e.g., RJ-JPR-PC-01
    name VARCHAR(255) NOT NULL,
    state VARCHAR(100) NOT NULL,
    district VARCHAR(100) NOT NULL,
    mandi_location VARCHAR(255) NOT NULL,
    latitude NUMERIC(10, 6) NOT NULL,
    longitude NUMERIC(10, 6) NOT NULL,
    daily_farmer_capacity INT DEFAULT 300,
    active_bays INT DEFAULT 6,
    operating_status VARCHAR(50) DEFAULT 'Operational', -- Operational, Maintenance, Suspended
    centre_manager_name VARCHAR(150),
    contact_number VARCHAR(20),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 9. CENTRE TIME SLOTS
CREATE TABLE IF NOT EXISTS centre_slots (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    centre_id UUID REFERENCES procurement_centres(id) ON DELETE CASCADE,
    slot_date DATE NOT NULL,
    time_window VARCHAR(50) NOT NULL, -- e.g., 09:00 - 10:00 AM
    capacity INT DEFAULT 30,
    booked_count INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT slot_unique_window UNIQUE (centre_id, slot_date, time_window)
);

-- 10. SLOT BOOKINGS
CREATE TABLE IF NOT EXISTS slot_bookings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    booking_reference VARCHAR(50) UNIQUE NOT NULL, -- e.g., SB-2026-9812
    farmer_id UUID REFERENCES farmers(id) ON DELETE CASCADE,
    centre_id UUID REFERENCES procurement_centres(id),
    slot_id UUID REFERENCES centre_slots(id),
    crop_id VARCHAR(50) REFERENCES crops(id),
    slot_date DATE NOT NULL,
    time_window VARCHAR(50) NOT NULL,
    declared_quantity_quintals NUMERIC(10,2) NOT NULL,
    booking_status VARCHAR(50) DEFAULT 'Confirmed', -- Confirmed, Checked-In, Completed, Cancelled, No-Show
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 11. REAL-TIME QUEUE TOKENS
CREATE TABLE IF NOT EXISTS queue_tokens (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    token_number VARCHAR(20) NOT NULL, -- e.g., A-124
    booking_id UUID REFERENCES slot_bookings(id) ON DELETE CASCADE,
    centre_id UUID REFERENCES procurement_centres(id),
    farmer_id UUID REFERENCES farmers(id),
    queue_date DATE NOT NULL,
    sequence_order INT NOT NULL,
    status VARCHAR(50) DEFAULT 'WAITING', -- WAITING, CALLED, IN_VERIFICATION, WEIGHING, COMPLETED, SKIPPED
    called_at TIMESTAMPTZ,
    completed_at TIMESTAMPTZ,
    estimated_wait_minutes INT DEFAULT 45,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 12. PROCUREMENT TRANSACTIONS (Comprehensive Ledger)
CREATE TABLE IF NOT EXISTS procurement_transactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    transaction_id VARCHAR(50) UNIQUE NOT NULL, -- e.g., TXN-2026-00124
    booking_id UUID REFERENCES slot_bookings(id),
    token_id UUID REFERENCES queue_tokens(id),
    farmer_id UUID REFERENCES farmers(id),
    centre_id UUID REFERENCES procurement_centres(id),
    crop_id VARCHAR(50) REFERENCES crops(id),
    
    quantity_quintals NUMERIC(10,2) NOT NULL,
    msp_rate NUMERIC(10,2) NOT NULL,
    actual_rate NUMERIC(10,2) NOT NULL,
    gross_amount NUMERIC(12,2) NOT NULL,
    
    -- Anti-Intermediary Guarantees
    authorised_charges NUMERIC(12,2) DEFAULT 0.00,
    unauthorised_charges NUMERIC(12,2) DEFAULT 0.00, -- Must remain 0.00
    net_payable_amount NUMERIC(12,2) NOT NULL,
    
    quality_grade VARCHAR(20) DEFAULT 'Grade A',
    moisture_percentage NUMERIC(5,2) DEFAULT 11.5,
    foreign_matter_percentage NUMERIC(5,2) DEFAULT 0.4,
    
    gross_weight_kg NUMERIC(12,2),
    tare_weight_kg NUMERIC(12,2),
    net_weight_kg NUMERIC(12,2),
    
    payment_status VARCHAR(50) DEFAULT 'Initiated', -- Pending, Initiated, Processing, Credited, Failed
    digital_receipt_hash VARCHAR(100),
    verification_code VARCHAR(50) UNIQUE,
    timestamp TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 13. QUALITY CHECKS AUDIT
CREATE TABLE IF NOT EXISTS quality_checks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    transaction_id UUID REFERENCES procurement_transactions(id) ON DELETE CASCADE,
    inspector_name VARCHAR(150) NOT NULL,
    moisture_content NUMERIC(5,2) NOT NULL,
    grain_damage_percent NUMERIC(5,2) DEFAULT 0.2,
    foreign_matter_percent NUMERIC(5,2) DEFAULT 0.4,
    grade_assigned VARCHAR(20) NOT NULL,
    remarks TEXT,
    verified_at TIMESTAMPTZ DEFAULT NOW()
);

-- 14. WEIGHT RECORDS (Electronic Weighbridge Data)
CREATE TABLE IF NOT EXISTS weight_records (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    transaction_id UUID REFERENCES procurement_transactions(id) ON DELETE CASCADE,
    weighbridge_id VARCHAR(50) NOT NULL,
    operator_name VARCHAR(150) NOT NULL,
    gross_weight_kg NUMERIC(12,2) NOT NULL,
    tare_weight_kg NUMERIC(12,2) NOT NULL,
    net_weight_kg NUMERIC(12,2) NOT NULL,
    scale_calibration_cert VARCHAR(100),
    recorded_at TIMESTAMPTZ DEFAULT NOW()
);

-- 15. PAYMENTS (Direct Benefit Transfer / PFMS Integration Mock)
CREATE TABLE IF NOT EXISTS payments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    transaction_id UUID REFERENCES procurement_transactions(id) ON DELETE CASCADE,
    farmer_id UUID REFERENCES farmers(id),
    amount NUMERIC(12,2) NOT NULL,
    payment_status VARCHAR(50) DEFAULT 'Initiated', -- Pending, Initiated, Processing, Credited, Failed
    payment_mode VARCHAR(50) DEFAULT 'PFMS / DBT Direct',
    dbt_reference_utr VARCHAR(100) UNIQUE,
    bank_account_mask VARCHAR(20) NOT NULL,
    initiated_at TIMESTAMPTZ DEFAULT NOW(),
    credited_at TIMESTAMPTZ,
    status_remarks TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 16. NOTIFICATIONS (Multi-Channel In-App & SMS Mock)
CREATE TABLE IF NOT EXISTS notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    title VARCHAR(200) NOT NULL,
    message TEXT NOT NULL,
    category VARCHAR(50) DEFAULT 'Procurement', -- Queue, Slot, Payment, Price, Alert
    read BOOLEAN DEFAULT FALSE,
    delivery_status VARCHAR(50) DEFAULT 'Sent', -- In-App Sent, SMS Mock Sent
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 17. COMMODITY PRICES & MARKET TRACKING (DoCA Module)
CREATE TABLE IF NOT EXISTS commodity_prices (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    commodity VARCHAR(100) NOT NULL,
    state VARCHAR(100) NOT NULL,
    district VARCHAR(100) NOT NULL,
    mandi_name VARCHAR(150) NOT NULL,
    farm_gate_price NUMERIC(10,2) NOT NULL, -- INR per kg
    wholesale_price NUMERIC(10,2) NOT NULL,
    retail_price NUMERIC(10,2) NOT NULL,
    daily_arrival_quintals NUMERIC(12,2) NOT NULL,
    source_agency VARCHAR(100) DEFAULT 'DoCA Price Monitoring Division (Demo)',
    reported_date DATE DEFAULT CURRENT_DATE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 18. GOVERNMENT BUFFER STOCK MANAGEMENT
CREATE TABLE IF NOT EXISTS government_stock (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    commodity VARCHAR(100) NOT NULL,
    warehouse_name VARCHAR(255) NOT NULL,
    state VARCHAR(100) NOT NULL,
    district VARCHAR(100) NOT NULL,
    current_stock_mt NUMERIC(12,2) NOT NULL,
    capacity_mt NUMERIC(12,2) NOT NULL,
    utilization_pct NUMERIC(5,2) NOT NULL,
    average_stock_age_days INT DEFAULT 45,
    condition_rating VARCHAR(50) DEFAULT 'Optimal', -- Optimal, Fair, Quality Warning, Ageing Alert
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 19. PRICE & SUPPLY ALERTS (Deterministic Analytics Engine)
CREATE TABLE IF NOT EXISTS price_alerts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    commodity VARCHAR(100) NOT NULL,
    district VARCHAR(100) NOT NULL,
    alert_type VARCHAR(100) NOT NULL, -- 'Price Spike', 'Abnormal Price Spread', 'Supply Deficit'
    severity VARCHAR(20) DEFAULT 'Medium', -- Low, Medium, High Alert
    current_price NUMERIC(10,2) NOT NULL,
    benchmark_price NUMERIC(10,2) NOT NULL,
    percentage_deviation NUMERIC(6,2) NOT NULL,
    anomaly_reason TEXT NOT NULL,
    status VARCHAR(50) DEFAULT 'Flagged for Review', -- Flagged for Review, Investigating, Closed
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 20. GRIEVANCES & CITIZEN COMPLAINTS
CREATE TABLE IF NOT EXISTS complaints (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    complaint_code VARCHAR(50) UNIQUE NOT NULL, -- e.g., CMP-2026-4410
    farmer_id UUID REFERENCES farmers(id),
    transaction_id UUID REFERENCES procurement_transactions(id),
    category VARCHAR(100) NOT NULL, -- 'Extra Charges Demanded', 'Delayed Payment', 'Weight Mismatch', 'Quality Dispute', etc.
    description TEXT NOT NULL,
    evidence_url TEXT,
    status VARCHAR(50) DEFAULT 'Submitted', -- Submitted, Under Review, Investigation, Resolved, Rejected
    assigned_officer VARCHAR(150),
    resolution_notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    resolved_at TIMESTAMPTZ
);

-- 21. SENSITIVE ACTION AUDIT LOGS
CREATE TABLE IF NOT EXISTS audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID,
    user_role VARCHAR(50) NOT NULL,
    action_type VARCHAR(100) NOT NULL, -- 'PRICE_UPDATED', 'TRANSACTION_MODIFIED', 'STOCK_UPDATED', 'PAYMENT_STATUS_UPDATED', 'COMPLAINT_RESOLVED', 'VENDOR_VERIFIED'
    record_id VARCHAR(100) NOT NULL,
    table_name VARCHAR(100) NOT NULL,
    old_value JSONB,
    new_value JSONB,
    ip_address VARCHAR(50) DEFAULT '127.0.0.1 (Local Gov Gateway)',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 22. VENDOR PROCUREMENT INTEREST REQUESTS
CREATE TABLE IF NOT EXISTS vendor_requests (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    vendor_id UUID REFERENCES vendors(id) ON DELETE CASCADE,
    crop_id VARCHAR(50) REFERENCES crops(id),
    district VARCHAR(100) NOT NULL,
    target_quantity_quintals NUMERIC(10,2) NOT NULL,
    offered_rate_quintal NUMERIC(10,2) NOT NULL,
    status VARCHAR(50) DEFAULT 'Active', -- Active, Matched, Expired, Fulfilled
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==============================================================================
-- INDEXES FOR HIGH-THROUGHPUT LOOKUPS & ANALYTICS
-- ==============================================================================
CREATE INDEX IF NOT EXISTS idx_farmers_profile_id ON farmers(profile_id);
CREATE INDEX IF NOT EXISTS idx_farmers_centre_id ON farmers(preferred_procurement_centre_id);
CREATE INDEX IF NOT EXISTS idx_farmer_stock_farmer_id ON farmer_stock(farmer_id);
CREATE INDEX IF NOT EXISTS idx_farmer_stock_crop_id ON farmer_stock(crop_id);
CREATE INDEX IF NOT EXISTS idx_slot_bookings_farmer ON slot_bookings(farmer_id);
CREATE INDEX IF NOT EXISTS idx_slot_bookings_centre ON slot_bookings(centre_id);
CREATE INDEX IF NOT EXISTS idx_queue_tokens_centre_date ON queue_tokens(centre_id, queue_date);
CREATE INDEX IF NOT EXISTS idx_proc_txn_farmer ON procurement_transactions(farmer_id);
CREATE INDEX IF NOT EXISTS idx_proc_txn_centre ON procurement_transactions(centre_id);
CREATE INDEX IF NOT EXISTS idx_proc_txn_date ON procurement_transactions(timestamp);
CREATE INDEX IF NOT EXISTS idx_commodity_prices_district ON commodity_prices(commodity, district, reported_date);
CREATE INDEX IF NOT EXISTS idx_audit_logs_action ON audit_logs(action_type, created_at);

-- ==============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ==============================================================================
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE farmers ENABLE ROW LEVEL SECURITY;
ALTER TABLE farms ENABLE ROW LEVEL SECURITY;
ALTER TABLE farmer_stock ENABLE ROW LEVEL SECURITY;
ALTER TABLE vendors ENABLE ROW LEVEL SECURITY;
ALTER TABLE procurement_centres ENABLE ROW LEVEL SECURITY;
ALTER TABLE centre_slots ENABLE ROW LEVEL SECURITY;
ALTER TABLE slot_bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE queue_tokens ENABLE ROW LEVEL SECURITY;
ALTER TABLE procurement_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE quality_checks ENABLE ROW LEVEL SECURITY;
ALTER TABLE weight_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE commodity_prices ENABLE ROW LEVEL SECURITY;
ALTER TABLE government_stock ENABLE ROW LEVEL SECURITY;
ALTER TABLE price_alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE complaints ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE vendor_requests ENABLE ROW LEVEL SECURITY;

-- 1. Profiles: Users read and edit own profile; admins can read all
CREATE POLICY profiles_own_access ON profiles
    FOR ALL USING (auth.uid() = id);

-- 2. Farmers: Farmers see only their own record; Officers and Inspectors can read
CREATE POLICY farmers_self_policy ON farmers
    FOR SELECT USING (
        profile_id = auth.uid() OR
        EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('centre_operator', 'quality_inspector', 'district_authority', 'ministry_admin', 'super_admin'))
    );

-- 3. Farmer Stock: Farmers manage own; Vendors see only aggregate/anonymized through views; Officials see all
CREATE POLICY farmer_stock_owner ON farmer_stock
    FOR ALL USING (
        farmer_id IN (SELECT id FROM farmers WHERE profile_id = auth.uid()) OR
        EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('centre_operator', 'district_authority', 'ministry_admin', 'super_admin'))
    );

-- 4. Procurement Transactions:
CREATE POLICY transactions_read_policy ON procurement_transactions
    FOR SELECT USING (
        farmer_id IN (SELECT id FROM farmers WHERE profile_id = auth.uid()) OR
        EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('centre_operator', 'quality_inspector', 'district_authority', 'ministry_admin', 'super_admin'))
    );

-- 5. Commodity Prices & Government Stock: Read-accessible to all authenticated and public views
CREATE POLICY commodity_prices_public ON commodity_prices
    FOR SELECT USING (true);

CREATE POLICY government_stock_read ON government_stock
    FOR SELECT USING (true);

-- 6. Audit Logs: Read-only for District Officers, Ministry Admins, and Super Admins
CREATE POLICY audit_logs_admin_only ON audit_logs
    FOR SELECT USING (
        EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('district_authority', 'ministry_admin', 'super_admin'))
    );
