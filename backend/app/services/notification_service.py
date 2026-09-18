from datetime import datetime
from sqlalchemy.orm import Session
from app.models.notification import Notification
from app.services.websocket_manager import ws_manager

class NotificationService:
    @staticmethod
    async def create_notification(
        db: Session,
        user_id: int,
        title: str,
        message: str,
        notif_type: str = "info"
    ) -> Notification:
        notif = Notification(
            user_id=user_id,
            title=title,
            message=message,
            type=notif_type,
            is_read=False,
            created_at=datetime.utcnow()
        )
        db.add(notif)
        db.commit()
        db.refresh(notif)

        # Send live push over WebSocket
        await ws_manager.send_user_notification(user_id, {
            "type": "NEW_NOTIFICATION",
            "notification": {
                "id": notif.id,
                "title": notif.title,
                "message": notif.message,
                "type": notif.type,
                "created_at": notif.created_at.isoformat()
            }
        })

        return notif
