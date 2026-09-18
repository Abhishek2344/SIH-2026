from datetime import date, datetime, timedelta
from sqlalchemy.orm import Session
from app.database import SessionLocal, Base, engine
from app.models.user import User, UserRole, Farmer, Staff
from app.models.centre import Centre
from app.models.slot import Slot
from app.models.booking import Booking, BookingStatus
from app.models.queue import QueueEntry, QueueStatus
from app.models.procurement import Procurement
from app.models.payment import Payment, PaymentStatus
from app.models.notification import Notification
from app.utils.security import hash_password

def seed_database():
    # Ensure tables exist
    Base.metadata.create_all(bind=engine)
    db: Session = SessionLocal()

    try:
        # Check if already seeded
        if db.query(User).filter(User.mobile == "9999999999").first():
            print("Database already seeded with demo data.")
            return

        print("Seeding database with initial users, centres, slots, and active queue...")

        # 1. Super Admin
        admin_user = User(
            email="admin@gov.in",
            mobile="9999999999",
            hashed_password=hash_password("Admin@123"),
            role=UserRole.ADMIN.value,
            is_active=True
        )
        db.add(admin_user)

        # 2. Centres
        centres_data = [
            {
                "code": "CTR-PB-01",
                "name": "Khanna Grain Market Procurement Hub",
                "state": "Punjab",
                "district": "Ludhiana",
                "address": "GT Road, Grain Market Yard, Khanna, Punjab 141401",
                "latitude": 30.7073,
                "longitude": 76.2166,
                "opening_time": "08:00 AM",
                "closing_time": "05:00 PM",
                "contact_phone": "+91 1628 220111",
                "commodities": "Wheat, Paddy, Maize, Mustard",
                "daily_capacity": 60
            },
            {
                "code": "CTR-HR-02",
                "name": "Karnal Mandi Agriculture Depot",
                "state": "Haryana",
                "district": "Karnal",
                "address": "Sector 4, New Anaj Mandi, Karnal, Haryana 132001",
                "latitude": 29.6857,
                "longitude": 76.9905,
                "opening_time": "08:30 AM",
                "closing_time": "05:30 PM",
                "contact_phone": "+91 184 2253441",
                "commodities": "Basmati Paddy, Wheat, Mustard",
                "daily_capacity": 50
            },
            {
                "code": "CTR-MP-03",
                "name": "Narmadapuram Wheat Procurement Centre",
                "state": "Madhya Pradesh",
                "district": "Narmadapuram",
                "address": "Itarsi Road, Krishi Upaj Mandi, Hoshangabad, MP 461001",
                "latitude": 22.7533,
                "longitude": 77.7289,
                "opening_time": "08:00 AM",
                "closing_time": "05:00 PM",
                "contact_phone": "+91 7574 252100",
                "commodities": "Sharbati Wheat, Gram, Soybean",
                "daily_capacity": 55
            },
            {
                "code": "CTR-UP-04",
                "name": "Aligarh Krishi Upaj Mandi Samiti",
                "state": "Uttar Pradesh",
                "district": "Aligarh",
                "address": "Ramghat Road, Mandi Parisar, Aligarh, UP 202001",
                "latitude": 27.8974,
                "longitude": 78.0880,
                "opening_time": "09:00 AM",
                "closing_time": "06:00 PM",
                "contact_phone": "+91 571 2741120",
                "commodities": "Wheat, Paddy, Mustard, Bajra",
                "daily_capacity": 45
            }
        ]

        created_centres = []
        for c in centres_data:
            centre = Centre(**c)
            db.add(centre)
            created_centres.append(centre)
        db.flush()

        primary_centre = created_centres[0]

        # 3. Staff User
        staff_user = User(
            email="staff.centre1@gov.in",
            mobile="8888888888",
            hashed_password=hash_password("Staff@123"),
            role=UserRole.STAFF.value,
            is_active=True
        )
        db.add(staff_user)
        db.flush()

        staff_profile = Staff(
            user_id=staff_user.id,
            staff_code="STF-101",
            full_name="Harpreet Singh",
            designation="Chief Procurement Officer",
            centre_id=primary_centre.id
        )
        db.add(staff_profile)

        # 4. Demo Farmer 1 (Main test farmer: Ramesh Kumar)
        farmer_user1 = User(
            email="ramesh.farmer@gmail.com",
            mobile="9876543210",
            hashed_password=hash_password("Farmer@123"),
            role=UserRole.FARMER.value,
            is_active=True
        )
        db.add(farmer_user1)
        db.flush()

        farmer1 = Farmer(
            user_id=farmer_user1.id,
            farmer_id="FID-2026-001",
            full_name="Ramesh Kumar",
            mobile="9876543210",
            address="Village Khanna Khurd, Post Khanna",
            district="Ludhiana",
            state="Punjab",
            preferred_language="en"
        )
        db.add(farmer1)

        # Demo Farmer 2 (Gurmukh Singh)
        farmer_user2 = User(
            email="gurmukh.singh@gmail.com",
            mobile="9811122233",
            hashed_password=hash_password("Farmer@123"),
            role=UserRole.FARMER.value,
            is_active=True
        )
        db.add(farmer_user2)
        db.flush()

        farmer2 = Farmer(
            user_id=farmer_user2.id,
            farmer_id="FID-2026-002",
            full_name="Gurmukh Singh",
            mobile="9811122233",
            address="Village Samrala, GT Road",
            district="Ludhiana",
            state="Punjab",
            preferred_language="hi"
        )
        db.add(farmer2)

        # Demo Farmer 3 (Balwinder Kaur)
        farmer_user3 = User(
            email="balwinder.kaur@gmail.com",
            mobile="9822233344",
            hashed_password=hash_password("Farmer@123"),
            role=UserRole.FARMER.value,
            is_active=True
        )
        db.add(farmer_user3)
        db.flush()

        farmer3 = Farmer(
            user_id=farmer_user3.id,
            farmer_id="FID-2026-003",
            full_name="Balwinder Kaur",
            mobile="9822233344",
            address="Village Payal, Dist Ludhiana",
            district="Ludhiana",
            state="Punjab",
            preferred_language="en"
        )
        db.add(farmer3)
        db.flush()

        # 5. Create slots for today and next 5 days
        today = date.today()
        slot_times = [
            ("08:00 AM", "10:00 AM", 15),
            ("10:00 AM", "12:00 PM", 15),
            ("12:30 PM", "02:30 PM", 15),
            ("02:30 PM", "04:30 PM", 15)
        ]

        today_slots = []
        for c in created_centres:
            for day_offset in range(6):
                slot_date = today + timedelta(days=day_offset)
                for start, end, cap in slot_times:
                    slot = Slot(
                        centre_id=c.id,
                        slot_date=slot_date,
                        start_time=start,
                        end_time=end,
                        capacity=cap,
                        booked_count=0,
                        is_active=True
                    )
                    db.add(slot)
                    if c.id == primary_centre.id and day_offset == 0:
                        today_slots.append(slot)
        db.flush()

        # 6. Seed active queue for today at Khanna Hub (Centre 1)
        # Slot 1: 08:00 AM - 10:00 AM
        slot_morning = today_slots[0]
        slot_midday = today_slots[1]

        # Booking 1 (Token 101 - Completed)
        b1 = Booking(
            booking_number="BK-2026-CTRPB1-00101",
            farmer_id=farmer3.id,
            centre_id=primary_centre.id,
            slot_id=slot_morning.id,
            booking_date=today,
            token_number=101,
            token_display="TK-101",
            crop_type="Wheat",
            estimated_quantity_quintals=20.0,
            status=BookingStatus.COMPLETED.value
        )
        db.add(b1)
        db.flush()
        slot_morning.booked_count += 1

        q1 = QueueEntry(
            booking_id=b1.id,
            centre_id=primary_centre.id,
            token_number=101,
            queue_date=today,
            position=1,
            status=QueueStatus.COMPLETED.value,
            check_in_time=datetime.utcnow() - timedelta(minutes=90),
            called_time=datetime.utcnow() - timedelta(minutes=80),
            serving_start_time=datetime.utcnow() - timedelta(minutes=75),
            completed_time=datetime.utcnow() - timedelta(minutes=45)
        )
        db.add(q1)

        p1 = Procurement(
            booking_id=b1.id,
            centre_id=primary_centre.id,
            farmer_id=farmer3.id,
            staff_id=staff_profile.id,
            receipt_number="REC-2026-PB-9801",
            crop_name="Wheat (PBW 550)",
            variety="Sharbati Premium",
            grade="Grade A",
            moisture_percentage=11.5,
            quantity_quintals=20.0,
            msp_rate_per_quintal=2275.0,
            total_amount=45500.0,
            procurement_date=datetime.utcnow() - timedelta(minutes=45),
            remarks="Excellent moisture content and grain quality."
        )
        db.add(p1)
        db.flush()

        pay1 = Payment(
            procurement_id=p1.id,
            farmer_id=farmer3.id,
            amount=45500.0,
            status=PaymentStatus.PAID.value,
            transaction_id="UTR202609180049281",
            payment_method="Direct Benefit Transfer (DBT)",
            payment_date=datetime.utcnow() - timedelta(minutes=30),
            bank_name="Punjab National Bank",
            account_last4="3344",
            remarks="DBT credited successfully to Aadhaar linked account"
        )
        db.add(pay1)

        # Booking 2 (Token 102 - Serving now)
        b2 = Booking(
            booking_number="BK-2026-CTRPB1-00102",
            farmer_id=farmer2.id,
            centre_id=primary_centre.id,
            slot_id=slot_morning.id,
            booking_date=today,
            token_number=102,
            token_display="TK-102",
            crop_type="Wheat",
            estimated_quantity_quintals=15.0,
            status=BookingStatus.SERVING.value
        )
        db.add(b2)
        db.flush()
        slot_morning.booked_count += 1

        q2 = QueueEntry(
            booking_id=b2.id,
            centre_id=primary_centre.id,
            token_number=102,
            queue_date=today,
            position=2,
            status=QueueStatus.SERVING.value,
            check_in_time=datetime.utcnow() - timedelta(minutes=50),
            called_time=datetime.utcnow() - timedelta(minutes=30),
            serving_start_time=datetime.utcnow() - timedelta(minutes=15)
        )
        db.add(q2)

        # Booking 3 (Token 103 - Waiting - DEMO FARMER Ramesh Kumar)
        b3 = Booking(
            booking_number="BK-2026-CTRPB1-00103",
            farmer_id=farmer1.id,
            centre_id=primary_centre.id,
            slot_id=slot_morning.id,
            booking_date=today,
            token_number=103,
            token_display="TK-103",
            crop_type="Wheat",
            estimated_quantity_quintals=25.0,
            status=BookingStatus.WAITING.value
        )
        db.add(b3)
        db.flush()
        slot_morning.booked_count += 1

        q3 = QueueEntry(
            booking_id=b3.id,
            centre_id=primary_centre.id,
            token_number=103,
            queue_date=today,
            position=3,
            status=QueueStatus.WAITING.value,
            check_in_time=datetime.utcnow() - timedelta(minutes=20)
        )
        db.add(q3)

        # Booking 4 (Token 104 - Waiting)
        b4 = Booking(
            booking_number="BK-2026-CTRPB1-00104",
            farmer_id=farmer2.id,
            centre_id=primary_centre.id,
            slot_id=slot_midday.id,
            booking_date=today,
            token_number=104,
            token_display="TK-104",
            crop_type="Mustard",
            estimated_quantity_quintals=12.0,
            status=BookingStatus.WAITING.value
        )
        db.add(b4)
        db.flush()
        slot_midday.booked_count += 1

        q4 = QueueEntry(
            booking_id=b4.id,
            centre_id=primary_centre.id,
            token_number=104,
            queue_date=today,
            position=4,
            status=QueueStatus.WAITING.value,
            check_in_time=datetime.utcnow() - timedelta(minutes=10)
        )
        db.add(q4)

        # 7. Notifications for Ramesh Kumar
        n1 = Notification(
            user_id=farmer_user1.id,
            title="Slot Booking Confirmed",
            message="Your procurement booking at Khanna Grain Market Hub for today is confirmed. Your Token is TK-103.",
            type="booking_confirmed",
            is_read=False,
            created_at=datetime.utcnow() - timedelta(hours=2)
        )
        n2 = Notification(
            user_id=farmer_user1.id,
            title="Token Approaching!",
            message="Token 102 is currently serving. Your token TK-103 is next! Please be ready at Counter 1.",
            type="queue",
            is_read=False,
            created_at=datetime.utcnow() - timedelta(minutes=15)
        )
        db.add_all([n1, n2])

        db.commit()
        print("Database seeded successfully!")

    except Exception as e:
        db.rollback()
        print(f"Error seeding database: {e}")
        raise e
    finally:
        db.close()

if __name__ == "__main__":
    seed_database()
