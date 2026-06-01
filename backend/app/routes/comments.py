"""Comment endpoints: create a comment on a post, and list a post's comments."""

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import select

from app.auth import get_current_user
from app.database import get_db
from app.models import Comment, Post, User
from app.schemas import CommentCreate, CommentResponse

router = APIRouter()


@router.post("/posts/{post_id}/comments", response_model=CommentResponse, status_code=201)
async def create_comment(
    post_id: int,
    body: CommentCreate,
    db=Depends(get_db),
    current_user=Depends(get_current_user),
):
    """Add a comment to a post and return it.

    Raises:
        HTTPException: 404 if the post does not exist.
    """
    post = await db.get(Post, post_id)
    if post is None:
        raise HTTPException(status_code=404, detail="Post not found")

    comment = Comment(post_id=post_id, author_id=current_user.id, content=body.content)
    db.add(comment)
    await db.commit()
    await db.refresh(comment)
    return CommentResponse(
        id=comment.id,
        content=comment.content,
        username=current_user.username,
        created_at=comment.created_at,
    )


@router.get("/posts/{post_id}/comments", response_model=list[CommentResponse])
async def list_comments(post_id: int, db=Depends(get_db), current_user=Depends(get_current_user)):
    """List a post's comments, oldest first (reads like a thread)."""
    rows = await db.execute(
        select(Comment, User.username)
        .join(User, Comment.author_id == User.id)
        .where(Comment.post_id == post_id)
        .order_by(Comment.created_at.asc())
    )
    return [
        CommentResponse(
            id=comment.id,
            content=comment.content,
            username=username,
            created_at=comment.created_at,
        )
        for comment, username in rows.all()
    ]
