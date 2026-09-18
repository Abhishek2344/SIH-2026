import httpx
import uuid
from datetime import date

BASE_URL = "http://localhost:8000"

def run_e2e():
    print("=== STARTING FULL END-TO-END VERIFICATION ===")
    client = httpx.Client(base_url=BASE_URL, timeout=10.0)

    # 1. Health check
    h = client.get("/api/health").json()
    assert h["status"] == "online"
    print("[OK] Health Check Passed")

    # 2. Farmer Registration
    mobile = f"97{str(uuid.uuid4().int)[:8]}"
    reg_payload = {
        "name": "Kuldeep Sandhu",
        "mobile": mobile,
        "password": "Farmer@123",
        "address": "Village Sahnewal, GT Road",
        "district": "Ludhiana",
        "state": "Punjab",
        "preferred_language": "en"
    }
    reg_res = client.post("/api/auth/register", json=reg_payload)
    assert reg_res.status_code == 201, reg_res.text
    farmer_data = reg_res.json()
    farmer_token = farmer_data["access_token"]
    farmer_id = farmer_data["user"]["farmer_profile"]["farmer_id"]
    print(f"[OK] Farmer Registration Passed: {farmer_id} (Mobile: {mobile})")

    # 3. Browse Centres
    centres = client.get("/api/centres").json()
    assert len(centres) >= 4
    khanna = next(c for c in centres if c["code"] == "CTR-PB-01")
    print(f"[OK] Centres Listed: {len(centres)} centres found. Khanna queue: {khanna['current_queue_size']}")

    # 4. Check Available Slots
    today_str = str(date.today())
    slots = client.get(f"/api/slots?centre_id={khanna['id']}&slot_date={today_str}").json()
    avail_slot = next(s for s in slots if not s["is_full"])
    print(f"[OK] Slot Availability: Found slot {avail_slot['start_time']} - {avail_slot['end_time']} ({avail_slot['available_count']} open)")

    # 5. Book Slot & Generate Unique Token
    booking_payload = {
        "centre_id": khanna["id"],
        "slot_id": avail_slot["id"],
        "booking_date": today_str,
        "crop_type": "Wheat (HD 2967)",
        "estimated_quantity_quintals": 30.0
    }
    book_res = client.post(
        "/api/bookings",
        json=booking_payload,
        headers={"Authorization": f"Bearer {farmer_token}"}
    )
    assert book_res.status_code == 201, book_res.text
    booking = book_res.json()
    token_display = booking["token_display"]
    print(f"[OK] Slot Booked Successfully! Token: {token_display} (Booking Ref: {booking['booking_number']})")

    # 6. Check Farmer Queue Status & Waiting Time
    farmer_q = client.get(
        f"/api/queue/farmer/status?centre_id={khanna['id']}",
        headers={"Authorization": f"Bearer {farmer_token}"}
    ).json()
    assert farmer_q["farmer_token"] == token_display
    assert farmer_q["farmer_status"] == "waiting"
    print(f"[OK] Farmer Queue Tracking: People ahead: {farmer_q['people_ahead']}, Est. Wait: {farmer_q['estimated_wait_minutes']} mins")

    # 7. Staff Operations
    # Staff Login
    staff_login = client.post("/api/auth/login", json={
        "username": "staff.centre1@gov.in",
        "password": "Staff@123"
    }).json()
    staff_token = staff_login["access_token"]
    print("[OK] Staff Login Passed")

    # Staff Call Next Farmer
    call_res = client.post(
        f"/api/queue/{khanna['id']}/call-next",
        headers={"Authorization": f"Bearer {staff_token}"}
    )
    assert call_res.status_code == 200
    called = call_res.json()
    print(f"[OK] Staff Called Next Farmer: Token {called.get('token_number')}")

    # Complete Procurement for this booking
    proc_payload = {
        "booking_id": booking["id"],
        "crop_name": "Wheat (HD 2967)",
        "variety": "Grade A Premium",
        "grade": "Grade A",
        "moisture_percentage": 11.8,
        "quantity_quintals": 30.0,
        "msp_rate_per_quintal": 2275.0,
        "remarks": "Sample fully verified, within 12% moisture tolerance"
    }
    proc_res = client.post(
        "/api/procurement",
        json=proc_payload,
        headers={"Authorization": f"Bearer {staff_token}"}
    )
    assert proc_res.status_code == 201, proc_res.text
    proc = proc_res.json()
    print(f"[OK] Procurement Completed! Receipt: {proc['receipt_number']}, Total Amount: Rs. {proc['total_amount']}")

    # Staff Disburses DBT Payment
    payments = client.get(
        "/api/payments",
        headers={"Authorization": f"Bearer {staff_token}"}
    ).json()
    farmer_payment = next(p for p in payments if p["procurement_id"] == proc["id"])
    assert farmer_payment["status"] == "pending"

    pay_update_res = client.put(
        f"/api/payments/{farmer_payment['id']}/status",
        json={
            "status": "paid",
            "transaction_id": "UTR202609180088991",
            "bank_name": "State Bank of India",
            "account_last4": "5566",
            "remarks": "DBT credit confirmed by RBI gateway"
        },
        headers={"Authorization": f"Bearer {staff_token}"}
    )
    assert pay_update_res.status_code == 200
    print(f"[OK] DBT Payment Disbursed: Rs. {farmer_payment['amount']} with UTR: UTR202609180088991")

    # 8. Admin Operations
    admin_login = client.post("/api/auth/login", json={
        "username": "admin@gov.in",
        "password": "Admin@123"
    }).json()
    admin_token = admin_login["access_token"]
    print("[OK] Super Admin Login Passed")

    stats = client.get(
        "/api/admin/stats",
        headers={"Authorization": f"Bearer {admin_token}"}
    ).json()
    print(f"[OK] Super Admin Stats: Total Farmers: {stats['total_farmers']}, Disbursed: Rs. {stats['total_disbursed_inr']}")

    reports = client.get(
        "/api/admin/reports",
        headers={"Authorization": f"Bearer {admin_token}"}
    ).json()
    print(f"[OK] Super Admin Reports: {len(reports['crop_summary'])} crop types tracked")

    print("=== ALL END-TO-END FLOW TESTS COMPLETED SUCCESSFULLY! ===")

if __name__ == "__main__":
    run_e2e()
