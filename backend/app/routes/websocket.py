from fastapi import APIRouter, WebSocket, WebSocketDisconnect
from app.services.websocket_manager import ws_manager
import logging

logger = logging.getLogger("smart_farmer.ws")
router = APIRouter(tags=["WebSockets"])

@router.websocket("/ws/queue/{centre_id}")
async def websocket_queue_endpoint(websocket: WebSocket, centre_id: int):
    await ws_manager.connect_centre(centre_id, websocket)
    try:
        while True:
            # Keep connection alive; client can send heartbeat ping
            data = await websocket.receive_text()
            if data == "ping":
                await websocket.send_text('{"type": "pong"}')
    except WebSocketDisconnect:
        ws_manager.disconnect_centre(centre_id, websocket)
    except Exception as e:
        logger.warning(f"WebSocket error on centre {centre_id}: {e}")
        ws_manager.disconnect_centre(centre_id, websocket)

@router.websocket("/ws/farmer/{user_id}")
async def websocket_farmer_endpoint(websocket: WebSocket, user_id: int):
    await ws_manager.connect_user(user_id, websocket)
    try:
        while True:
            data = await websocket.receive_text()
            if data == "ping":
                await websocket.send_text('{"type": "pong"}')
    except WebSocketDisconnect:
        ws_manager.disconnect_user(user_id, websocket)
    except Exception as e:
        logger.warning(f"WebSocket error on user {user_id}: {e}")
        ws_manager.disconnect_user(user_id, websocket)
