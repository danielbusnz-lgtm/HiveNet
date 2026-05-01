"""Pydantic request/response schemas for the API."""

from datetime import datetime, timezone

from pydantic import BaseModel, EmailStr, field_serializer


class UserRegister(BaseModel):
    """Body schema for `POST /register`."""

    username: str
    email: EmailStr
    password: str


class UserLogin(BaseModel):
    """Body schema for `POST /login`."""

    username: str
    password: str


class UserRespone(BaseModel):
    """Public user fields safe to return to clients."""

    id: int
    username: str
    email: EmailStr


class TokenResponse(BaseModel):
    """Wraps an issued JWT access token."""

    access_token: str


class PostCreate(BaseModel):
    """Body schema for `POST /posts`."""

    content: str


class PostResponse(BaseModel):
    """A post enriched with author username and viewer-specific like state."""

    id: int
    content: str
    username: str
    created_at: datetime
    like_count: int
    liked_by_me: bool

    @field_serializer("created_at")
    def serialize_created_at(self, dt: datetime) -> str:
        """Format `created_at` as a UTC ISO 8601 string (e.g. `2026-05-01T12:00:00Z`)."""
        if dt.tzinfo is None:
            dt = dt.replace(tzinfo=timezone.utc)
        return dt.isoformat().replace("+00:00", "Z")
