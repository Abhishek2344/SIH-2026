from typing import Dict, List, Set
from fastapi import WebSocket
import json
import logging

logger = logging.getLogger("smart_farmer.ws")

class ConnectionManager:
    def __init__(self):
        # centre_id -> Set of WebSockets
        self.centre_connections: Dict[int, Set[WebSocket]] = {}
        # user_id -> Set of WebSockets
        self.user_connections: Dict[int, Set[WebSocket]] = {}

    async def connect_centre(self, centre_id: int, websocket: WebSocket):
        await websocket.accept()
        if centre_id not in self.centre_connections:
            self.centre_connections[centre_id] = set()
        self.centre_connections[centre_id].add(websocket)
        logger.info(f"Client connected to centre {centre_id} queue. Total: {len(self.centre_connections[centre_id])}")

    def disconnect_centre(self, centre_id: int, websocket: WebSocket):
        if centre_id in self.centre_connections:
            self.centre_connections[centre_id].discard(websocket)
            if not self.centre_connections[centre_id]:
                del self.centre_connections[centre_id]
        logger.info(f"Client disconnected from centre {centre_id}")

    async def connect_user(self, user_id: int, websocket: WebSocket):
        await websocket.accept()
        if user_id not in self.user_connections:
            self.user_connections[user_id] = set()
        self.user_connections[user_id].add(websocket)
        logger.info(f"User {user_id} connected for private alerts.")

    def disconnect_user(self, user_id: int, websocket: WebSocket):
        if user_id in self.user_connections:
            self.user_connections[user_id].discard(websocket)
            if not self.user_connections[user_id]:
                del self.user_connections[user_id]

    async def broadcast_centre_queue(self, centre_id: int, message: dict):
        if centre_id not in self.centre_connections:
            return
        dead_connections = set()
        payload = json.dumps(message)
        for connection in self.centre_connections[centre_id]:
            try:
                await connection.send_text(payload)
            except Exception as e:
                logger.warning(f"Error sending to WS client in centre {centre_id}: {e}")
                dead_connections.add(connection)
        
        for dead in dead_connections:
            self.centre_connections[centre_id].discard(dead)

    async def send_user_notification(self, user_id: int, message: dict):
        if user_id not in self.user_connections:
            return
        dead_connections = set()
        payload = json.dumps(message)
        for connection in self.user_connections[user_id]:
            try:
                await connection.send_text(payload)
            except Exception as e:
                logger.warning(f"Error sending to WS user {user_id}: {e}")
                dead_connections.add(connection)

        for dead in dead_connections:
            self.user_connections[user_id].discard(dead)

ws_manager = ConnectionManager()
