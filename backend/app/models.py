"""SQLAlchemy ORM models: User, Post, Follow, Like."""

from datetime import datetime

from sqlalchemy import DateTime, ForeignKey, String, UniqueConstraint, func
from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column


class Base(DeclarativeBase):
    """Declarative base for all ORM models."""

    pass


class User(Base):
    """A registered account with a unique username and email."""

    __tablename__ = "user_info"

    id: Mapped[int] = mapped_column(primary_key=True)
    username: Mapped[str] = mapped_column(String(30), unique=True)
    hashed_password: Mapped[str] = mapped_column(String(255))
    email_address: Mapped[str] = mapped_column(String(40), unique=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, server_default=func.now())


class Post(Base):
    """A short post authored by a user."""

    __tablename__ = "post"

    id: Mapped[int] = mapped_column(primary_key=True)
    author_id: Mapped[int] = mapped_column(ForeignKey("user_info.id"), index=True)
    content: Mapped[str] = mapped_column(String(500))
    created_at: Mapped[datetime] = mapped_column(DateTime, server_default=func.now(), index=True)


class Follow(Base):
    """A directed follower → following relationship between two users."""

    __tablename__ = "follow"

    id: Mapped[int] = mapped_column(primary_key=True)
    follower_id: Mapped[int] = mapped_column(ForeignKey("user_info.id"), index=True)
    following_id: Mapped[int] = mapped_column(ForeignKey("user_info.id"), index=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, server_default=func.now())


class Like(Base):
    """A user's like of a post; (user_id, post_id) is unique."""

    __tablename__ = "like"
    __table_args__ = (UniqueConstraint("user_id", "post_id", name="uq_like_user_post"),)

    id: Mapped[int] = mapped_column(primary_key=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("user_info.id"), index=True)
    post_id: Mapped[int] = mapped_column(ForeignKey("post.id"), index=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, server_default=func.now())
