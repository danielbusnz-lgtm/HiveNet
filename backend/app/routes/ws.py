"""WebSocket endpoint for the real-time feed.

Clients connect to `/ws?token=<jwt>` once on load. We don't expect inbound
messages yet; the connection exists so the server can push events (new posts,
like changes) the moment they happen. See app/realtime.py for the registry.
"""

from fastapi import APIRouter, WebSocket, WebSocketDisconnect

from app.auth import decode_token
from app.realtime import manager

router = APIRouter()


@router.websocket("/ws")
async def feed_socket(ws: WebSocket) -> None:
    # Browsers can't set an Authorization header on a WebSocket handshake, so
    # the JWT arrives as a query param: ws(s)://host/ws?token=<jwt>.
    token = ws.query_params.get("token", "")
    if decode_token(token) is None:
        # 1008 = policy violation. Reject before accepting the connection.
        await ws.close(code=1008)
        return

    await manager.connect(ws)
    try:
        # Keep the socket open and detect disconnects. We ignore the content;
        # the client isn't expected to send anything yet.
        while True:
            await ws.receive_text()
    except WebSocketDisconnect:
        await manager.disconnect(ws)
