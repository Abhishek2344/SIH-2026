import pytest
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_health_check():
    response = client.get("/api/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "online"

def test_login_success_farmer():
    response = client.post("/api/auth/login", json={
        "username": "9876543210",
        "password": "Farmer@123"
    })
    assert response.status_code == 200
    data = response.json()
    assert "access_token" in data
    assert data["user"]["role"] == "farmer"
    assert data["user"]["farmer_profile"]["farmer_id"] == "FID-2026-001"

def test_login_success_staff():
    response = client.post("/api/auth/login", json={
        "username": "staff.centre1@gov.in",
        "password": "Staff@123"
    })
    assert response.status_code == 200
    data = response.json()
    assert "access_token" in data
    assert data["user"]["role"] == "staff"

def test_login_success_admin():
    response = client.post("/api/auth/login", json={
        "username": "admin@gov.in",
        "password": "Admin@123"
    })
    assert response.status_code == 200
    data = response.json()
    assert "access_token" in data
    assert data["user"]["role"] == "admin"

def test_login_wrong_password():
    response = client.post("/api/auth/login", json={
        "username": "9876543210",
        "password": "WrongPassword"
    })
    assert response.status_code == 401

def test_register_farmer():
    import uuid
    rand_mobile = f"98{str(uuid.uuid4().int)[:8]}"
    response = client.post("/api/auth/register", json={
        "name": "Manjeet Singh",
        "mobile": rand_mobile,
        "password": "Farmer@123",
        "address": "Village Sirhind, Punjab",
        "district": "Fatehgarh Sahib",
        "state": "Punjab",
        "preferred_language": "pa"
    })
    assert response.status_code == 201
    data = response.json()
    assert "access_token" in data
    assert data["user"]["farmer_profile"]["full_name"] == "Manjeet Singh"
