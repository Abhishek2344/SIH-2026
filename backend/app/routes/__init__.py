from app.routes.auth import router as auth_router
from app.routes.centres import router as centres_router
from app.routes.slots import router as slots_router
from app.routes.bookings import router as bookings_router
from app.routes.queue import router as queue_router
from app.routes.procurement import router as procurement_router
from app.routes.payments import router as payments_router
from app.routes.notifications import router as notifications_router
from app.routes.staff import router as staff_router
from app.routes.admin import router as admin_router
from app.routes.websocket import router as websocket_router

__all__ = [
    "auth_router",
    "centres_router",
    "slots_router",
    "bookings_router",
    "queue_router",
    "procurement_router",
    "payments_router",
    "notifications_router",
    "staff_router",
    "admin_router",
    "websocket_router"
]
