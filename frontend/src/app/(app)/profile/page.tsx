'use client'
import { useEffect, useState } from 'react'
import { Heading, Subheading } from '@/components/heading'
import { Text, Strong } from '@/components/text'
import { Divider } from '@/components/divider'

type Me = {
    id: number
    username: string
    email: string
    created_at: string
    post_count: number
}

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

export default function ProfilePage() {
    const [me, setMe] = useState<Me | null>(null)
    const [posts, setPosts] = useState<Post[] | null>(null)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        const token = localStorage.getItem('token')
        const headers = { Authorization: `Bearer ${token}` }

        Promise.all([
            fetch('http://localhost:8000/me', { headers }).then((r) => {
                if (!r.ok) throw new Error(`me ${r.status}`)
                return r.json()
            }),
            fetch('http://localhost:8000/me/posts', { headers }).then((r) => {
                if (!r.ok) throw new Error(`me/posts ${r.status}`)
                return r.json()
            }),
        ])
            .then(([meData, postData]) => {
                setMe(meData)
                setPosts(postData)
            })
            .catch((e) => setError(e.message))
    }, [])

    if (error) return <Text>Failed to load profile: {error}</Text>
    if (!me || posts === null) return <Text>Loading…</Text>

    const joined = new Date(me.created_at).toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'long',
    })

    return (
        <div className="mx-auto flex w-full max-w-xl flex-col gap-8 p-8">
            <div>
                <Heading>@{me.username}</Heading>
                <Text className="mt-1">
                    {me.email} · Joined {joined} · {me.post_count} post
                    {me.post_count === 1 ? '' : 's'}
                </Text>
            </div>

            <Divider />

            <div>
                <Subheading>Your posts</Subheading>
                {posts.length === 0 ? (
                    <Text className="mt-4">You haven&apos;t posted yet.</Text>
                ) : (
                    <div className="mt-4 flex flex-col gap-4">
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
                )}
            </div>
        </div>
    )
}
