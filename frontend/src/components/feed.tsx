'use client'
import { useEffect, useState } from 'react'
import { Text, Strong } from '@/components/text'
import { Divider } from '@/components/divider'
import { API_URL } from '@/lib/api'

type Post = {
    id: number
    content: string
    username: string
    created_at: string
}

function timeAgo(iso: string) {
    const diffMs = Date.now() - new Date(iso).getTime()
    const sec = Math.floor(diffMs / 1000)
    if (sec < 60) return `${sec}s ago`
    const min = Math.floor(sec / 60)
    if (min < 60) return `${min}m ago`
    const hr = Math.floor(min / 60)
    if (hr < 24) return `${hr}h ago`
    const day = Math.floor(hr / 24)
    return `${day}d ago`
}

export function Feed({ refreshKey }: { refreshKey: number }) {
    const [posts, setPosts] = useState<Post[] | null>(null)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        const token = localStorage.getItem('token')

        fetch(`${API_URL}/feed`, {
            headers: { Authorization: `Bearer ${token}` },
        })
            .then((r) => {
                if (!r.ok) throw new Error(`${r.status}`)
                return r.json()
            })
            .then((data: Post[]) => setPosts(data))
            .catch((e) => setError(e.message))
    }, [refreshKey])

    if (error) return <Text>Failed to load feed: {error}</Text>
    if (posts === null) return <Text>Loading…</Text>
    if (posts.length === 0) return <Text>No posts yet. Follow someone or write the first one.</Text>

    return (
        <div className="flex flex-col gap-4">
            {posts.map((post, i) => (
                <div key={post.id}>
                    {i > 0 && <Divider className="mb-4" />}
                    <div className="flex items-baseline gap-2">
                        <Strong>@{post.username}</Strong>
                        <Text className="text-xs">{timeAgo(post.created_at)}</Text>
                    </div>
                    <Text className="mt-1 whitespace-pre-wrap">{post.content}</Text>
                </div>
            ))}
        </div>
    )
}
