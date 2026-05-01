'use client'
import { apiFetch } from '@/lib/api'
import { useEffect, useState } from 'react'

type User = {
    id: number
    username: string
    email: string
    post_count: number
    follower_count: number
    following_count: number
    is_followed_by_me: boolean
}

export default function UserProfilePage({ params }: { params: { username: string } }) {
    const [user, setUser] = useState<User | null>(null)

    useEffect(() => {
        apiFetch(`/users/${params.username}`)
            .then((r) => r.json())
            .then((data) => setUser(data))
    }, [])

    if (user === null) return <div>Loading…</div>

    return (
        <div>
            <h1>@{user.username}</h1>
            <p>{user.post_count} posts · {user.follower_count} followers</p>
        </div>
    )
}



