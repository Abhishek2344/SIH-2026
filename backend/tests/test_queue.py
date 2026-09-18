import pytest
from datetime import date
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def get_staff_token():
    resp = client.post("/api/auth/login", json={
        "username": "staff.centre1@gov.in",
        "password": "Staff@123"
    })
    return resp.json()["access_token"]

def get_farmer_token():
    resp = client.post("/api/auth/login", json={
        "username": "9876543210",
        "password": "Farmer@123"
    })
    return resp.json()["access_token"]

def test_live_queue():
    resp = client.get("/api/centres")
    centre_id = resp.json()[0]["id"]

    q_resp = client.get(f"/api/queue/{centre_id}")
    assert q_resp.status_code == 200
    data = q_resp.json()
    assert "total_in_queue" in data
    assert "serving_token" in data
    assert data["serving_token"] == "TK-102"
    assert "TK-103" in data["upcoming_tokens"]

def test_farmer_queue_status():
    token = get_farmer_token()
    resp = client.get("/api/queue/farmer/status", headers={"Authorization": f"Bearer {token}"})
    assert resp.status_code == 200
    data = resp.json()
    assert data["farmer_token"] == "TK-103"
    assert data["farmer_status"] == "waiting"
    # People ahead should be 1 (TK-102 is serving)
    assert data["people_ahead"] >= 1
    assert data["estimated_wait_minutes"] >= 15

def test_unauthorized_staff_action_by_farmer():
    farmer_token = get_farmer_token()
    # Farmer trying to call next farmer must be forbidden (403)
    resp = client.post("/api/queue/1/call-next", headers={"Authorization": f"Bearer {farmer_token}"})
    assert resp.status_code == 403
