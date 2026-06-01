"""In-memory WebSocket registry and broadcast helper.

Every connected browser's socket is held here so routes can push events
(new posts, like changes) to all of them in real time. Being in-memory means
this only works within a single process: fine for one Railway instance, but
scaling to multiple would need a shared bus (e.g. Redis pub/sub) so every
process sees every event.
"""

import asyncio

from fastapi import WebSocket


class ConnectionManager:
    """Tracks open sockets and fans a message out to all of them."""

    def __init__(self) -> None:
        self._connections: set[WebSocket] = set()
        # Guards the set: connect/disconnect can race with a broadcast.
        self._lock = asyncio.Lock()

    async def connect(self, ws: WebSocket) -> None:
        """Accept the handshake and register the socket."""
        await ws.accept()
        async with self._lock:
            self._connections.add(ws)

    async def disconnect(self, ws: WebSocket) -> None:
        async with self._lock:
            self._connections.discard(ws)

    async def broadcast(self, message: dict) -> None:
        """Send `message` (as JSON) to every connected socket.

        Sends are done on a snapshot taken under the lock, not while holding it,
        so one slow client can't block the others. Any socket that errors mid
        send is assumed dead and dropped.
        """
        async with self._lock:
            targets = list(self._connections)

        dead: list[WebSocket] = []
        for ws in targets:
            try:
                await ws.send_json(message)
            except Exception:
                dead.append(ws)

        if dead:
            async with self._lock:
                for ws in dead:
                    self._connections.discard(ws)


# Single shared instance the whole app talks to.
manager = ConnectionManager()
