from fastapi import APIRouter, Depends
from app.database import get_db
from app.auth import get_current_user
from app.models import Follow


router = APIRouter()


@router.post("/follow/{user_id}")
async def follow_user(user_id: int, db=Depends(get_db), current_user=Depends(get_current_user)):
    new_following = Follow(
        follower_id=current_user.id,
        following_id=user_id,
    )
    db.add(new_following)
    await db.commit()
    return {"message": "Followed"}
