-- ==============================================================================
-- smart-Mandi — Realistic Indian Demo Seed Data
-- ==============================================================================

-- 1. CROPS CATALOG
INSERT INTO crops (id, name, hindi_name, category, msp_rate, unit, quality_standards) VALUES
('wheat', 'Wheat (Sharbati/Kalyan)', 'गेहूं', 'Cereal', 2425.00, 'Quintal', '{"max_moisture_pct": 12.0, "max_foreign_matter_pct": 0.75, "min_test_weight": 76.0}'),
('rice', 'Paddy (Common / Basmati)', 'धान / चावल', 'Cereal', 2300.00, 'Quintal', '{"max_moisture_pct": 17.0, "max_foreign_matter_pct": 1.0, "broken_grain_max": 2.0}'),
('onion', 'Onion (Red Nashik)', 'प्याज', 'Vegetable', 1850.00, 'Quintal', '{"grade": "Standard Medium", "sprouting_max": 2.0}'),
('potato', 'Potato (Kufri Jyoti)', 'आलू', 'Vegetable', 1450.00, 'Quintal', '{"diameter_min_mm": 45, "greening_max_pct": 1.0}'),
('tomato', 'Tomato (Hybrid)', 'टमाटर', 'Vegetable', 2100.00, 'Quintal', '{"firmness": "Firm", "colour": "Turning Red"}'),
('chana', 'Gram / Chana Dal', 'चना', 'Pulse', 5440.00, 'Quintal', '{"max_moisture_pct": 10.0, "foreign_matter_pct": 0.5}'),
('mustard', 'Mustard Seed / Sarson', 'सरसों', 'Oilseed', 5650.00, 'Quintal', '{"oil_content_min_pct": 38.0, "moisture_pct": 8.0}')
ON CONFLICT (id) DO UPDATE SET msp_rate = EXCLUDED.msp_rate;

-- 2. PROCUREMENT CENTRES
INSERT INTO procurement_centres (id, code, name, state, district, mandi_location, latitude, longitude, daily_farmer_capacity, active_bays, operating_status, centre_manager_name, contact_number) VALUES
('11111111-1111-1111-1111-111111111101', 'RJ-JPR-PC-01', 'Jaipur Central Mandi Procurement Centre', 'Rajasthan', 'Jaipur', 'Muhana Mandi Complex, Gate No. 3, Sanganer, Jaipur', 26.8289, 75.7681, 300, 6, 'Operational', 'Shri Rajesh Sharma', '+91 94140 12345'),
('11111111-1111-1111-1111-111111111102', 'RJ-KOT-PC-02', 'Kota Krishi Upaj Mandi Procurement Hub', 'Rajasthan', 'Kota', 'Anantpura Industrial Area, Kota', 25.1384, 75.8457, 250, 5, 'Operational', 'Smt. Anita Verma', '+91 94140 67890'),
('11111111-1111-1111-1111-111111111103', 'PB-LDH-PC-01', 'Ludhiana Grain Procurement Centre', 'Punjab', 'Ludhiana', 'Dana Mandi, Gill Road, Ludhiana', 30.8920, 75.8340, 450, 8, 'Operational', 'S. Gurpreet Singh', '+91 98150 11223'),
('11111111-1111-1111-1111-111111111104', 'HR-HSR-PC-01', 'Hisar Agricultural Mandi Complex', 'Haryana', 'Hisar', 'New Grain Market, Delhi Road, Hisar', 29.1492, 75.7217, 300, 6, 'Operational', 'Shri Vikram Punia', '+91 98120 44556'),
('11111111-1111-1111-1111-111111111105', 'MP-IND-PC-01', 'Indore Sanwer Road Krishi Mandi Hub', 'Madhya Pradesh', 'Indore', 'Laxmibai Nagar Mandi, Indore', 22.7533, 75.8937, 350, 7, 'Operational', 'Dr. Alok Chouhan', '+91 94250 88990')
ON CONFLICT (id) DO NOTHING;

-- 3. COMMODITY PRICE MONITORING (DoCA Data Source)
INSERT INTO commodity_prices (commodity, state, district, mandi_name, farm_gate_price, wholesale_price, retail_price, daily_arrival_quintals, source_agency, reported_date) VALUES
('Wheat', 'Rajasthan', 'Jaipur', 'Muhana Mandi', 24.25, 27.50, 32.00, 4200.0, 'DoCA / Agmarknet Integrated Feed', CURRENT_DATE),
('Wheat', 'Punjab', 'Ludhiana', 'Dana Mandi', 24.25, 26.80, 31.50, 8900.0, 'DoCA / Agmarknet Integrated Feed', CURRENT_DATE),
('Wheat', 'Haryana', 'Hisar', 'New Grain Market', 24.25, 27.00, 31.80, 5400.0, 'DoCA / Agmarknet Integrated Feed', CURRENT_DATE),
('Rice', 'Punjab', 'Ludhiana', 'Dana Mandi', 23.00, 28.50, 36.00, 7200.0, 'DoCA / Agmarknet Integrated Feed', CURRENT_DATE),
('Onion', 'Maharashtra', 'Nashik', 'Lasalgaon Mandi', 18.50, 24.00, 35.00, 12500.0, 'DoCA / Agmarknet Integrated Feed', CURRENT_DATE),
('Onion', 'Rajasthan', 'Jaipur', 'Muhana Mandi', 21.00, 27.50, 38.00, 3100.0, 'DoCA / Agmarknet Integrated Feed', CURRENT_DATE),
('Potato', 'Uttar Pradesh', 'Agra', 'Fatehabad Mandi', 14.50, 18.20, 24.00, 15000.0, 'DoCA / Agmarknet Integrated Feed', CURRENT_DATE),
('Potato', 'Rajasthan', 'Jaipur', 'Muhana Mandi', 15.80, 20.50, 26.00, 4500.0, 'DoCA / Agmarknet Integrated Feed', CURRENT_DATE),
('Tomato', 'Rajasthan', 'Jaipur', 'Muhana Mandi', 28.00, 38.00, 52.00, 1850.0, 'DoCA / Agmarknet Integrated Feed', CURRENT_DATE),
('Chana', 'Madhya Pradesh', 'Indore', 'Laxmibai Nagar Mandi', 54.40, 62.00, 74.00, 3800.0, 'DoCA / Agmarknet Integrated Feed', CURRENT_DATE),
('Mustard', 'Rajasthan', 'Jaipur', 'Muhana Mandi', 56.50, 64.00, 135.00, 2900.0, 'DoCA / Agmarknet Integrated Feed', CURRENT_DATE);

-- 4. GOVERNMENT BUFFER STOCK MANAGEMENT
INSERT INTO government_stock (commodity, warehouse_name, state, district, current_stock_mt, capacity_mt, utilization_pct, average_stock_age_days, condition_rating) VALUES
('Wheat', 'Central Warehouse Corporation (CWC) Sanganer', 'Rajasthan', 'Jaipur', 10500.00, 15000.00, 70.00, 45, 'Optimal'),
('Wheat', 'Food Corporation of India (FCI) Silo Ludhiana', 'Punjab', 'Ludhiana', 42000.00, 50000.00, 84.00, 62, 'Optimal'),
('Rice', 'State Warehousing Godown Karnal', 'Haryana', 'Karnal', 24500.00, 30000.00, 81.67, 75, 'Optimal'),
('Chana', 'NAFED Buffer Depot Dewas', 'Madhya Pradesh', 'Dewas', 8200.00, 12000.00, 68.33, 90, 'Fair'),
('Mustard', 'Rajasthan State Seed Corp Warehouse Kota', 'Rajasthan', 'Kota', 6400.00, 8000.00, 80.00, 35, 'Optimal');

-- 5. PRICE ANOMALY & SUPPLY STRESS SIGNALS (AI/Rule Engine Prototype Output)
INSERT INTO price_alerts (commodity, district, alert_type, severity, current_price, benchmark_price, percentage_deviation, anomaly_reason, status) VALUES
('Tomato', 'Jaipur', 'Price Spike', 'High Alert', 52.00, 38.00, 36.84, 'Supply arrivals declined by 38% week-on-week due to unseasonal rain in Southern producing belts.', 'Flagged for Review'),
('Wheat', 'Jaipur', 'Abnormal Price Spread', 'Watch', 32.00, 28.50, 12.28, 'Farm-gate to retail price spread expanded from standard INR 6.2/kg to INR 7.75/kg without matching transport index change.', 'Flagged for Review'),
('Onion', 'Jaipur', 'Supply Stress Watch', 'Medium', 38.00, 32.00, 18.75, 'Mandi arrivals down 22% while cold storage dispatches dropped 15% in western corridors.', 'Investigating');
