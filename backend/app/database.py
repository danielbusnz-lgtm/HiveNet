"""Async SQLAlchemy engine, session factory, and the `get_db` dependency."""

from sqlalchemy.ext.asyncio import async_sessionmaker, create_async_engine

from app.config import DATABASE_URL

engine = create_async_engine(DATABASE_URL)
SessionLocal = async_sessionmaker(engine, expire_on_commit=False)


async def get_db():
    """Yield an async session that auto-closes when the request ends."""
    async with SessionLocal() as session:
        yield session
