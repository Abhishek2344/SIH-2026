import pytest
from datetime import date, timedelta
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def get_farmer_token():
    resp = client.post("/api/auth/login", json={
        "username": "9876543210",
        "password": "Farmer@123"
    })
    return resp.json()["access_token"]

def test_get_centres():
    resp = client.get("/api/centres")
    assert resp.status_code == 200
    centres = resp.json()
    assert len(centres) >= 4
    khanna = next(c for c in centres if c["code"] == "CTR-PB-01")
    assert khanna["current_queue_size"] >= 1

def test_get_slots():
    resp = client.get("/api/centres")
    centre_id = resp.json()[0]["id"]
    
    slots_resp = client.get(f"/api/slots?centre_id={centre_id}&slot_date={date.today()}")
    assert slots_resp.status_code == 200
    slots = slots_resp.json()
    assert len(slots) >= 1

def test_get_my_bookings():
    token = get_farmer_token()
    resp = client.get("/api/bookings/my", headers={"Authorization": f"Bearer {token}"})
    assert resp.status_code == 200
    bookings = resp.json()
    assert len(bookings) >= 1
    assert bookings[0]["token_display"] == "TK-103"
