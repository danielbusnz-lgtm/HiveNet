from fastapi import APIRouter, Depends
from sqlalchemy import select
from app.schemas import PostCreate, PostResponse
from app.database import get_db
from app.auth import get_current_user
from app.models import Post, Follow, User


router = APIRouter()


@router.post("/posts")
async def create_post(post: PostCreate, db=Depends(get_db), current_user=Depends(get_current_user)):


    new_post = Post(
    author_id = current_user.id,
    content=post.content,
    )

    db.add(new_post)
    await db.commit()
    return {"message": "Content Published"}

@router.get("/feed", response_model=list[PostResponse])
async def show_feed(db=Depends(get_db), current_user=Depends(get_current_user)):
    result = await db.execute(
        select(Follow.following_id).where(Follow.follower_id == current_user.id)
    )
    following_ids = result.scalars().all()

    author_ids = list(following_ids) + [current_user.id]

    rows = await db.execute(
        select(Post, User.username)
        .join(User, Post.author_id == User.id)
        .where(Post.author_id.in_(author_ids))
        .order_by(Post.created_at.desc())
    )
    return [
        PostResponse(
            id=post.id,
            content=post.content,
            username=username,
            created_at=post.created_at,
        )
        for post, username in rows.all()
    ]
