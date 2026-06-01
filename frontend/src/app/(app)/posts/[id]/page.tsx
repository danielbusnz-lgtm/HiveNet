'use client'
import { use, useEffect, useState } from 'react'
import { apiFetch } from '@/lib/api'
import { Button } from '@/components/button'
import { Divider } from '@/components/divider'
import { Field, Label } from '@/components/fieldset'
import { Link } from '@/components/link'
import { Strong, Text } from '@/components/text'
import { Textarea } from '@/components/textarea'

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

type Post = {
    id: number
    content: string
    username: string
    created_at: string
    like_count: number
    liked_by_me: boolean
    comment_count: number
}

type Comment = {
    id: number
    content: string
    username: string
    created_at: string
}

export default function PostDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params)
    const [post, setPost] = useState<Post | null>(null)
    const [comments, setComments] = useState<Comment[] | null>(null)
    const [content, setContent] = useState('')
    const [submitting, setSubmitting] = useState(false)

    useEffect(() => {
        apiFetch(`/posts/${id}`)
            .then((r) => (r.ok ? r.json() : null))
            .then(setPost)
        apiFetch(`/posts/${id}/comments`)
            .then((r) => r.json())
            .then(setComments)
    }, [id])

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        if (!content.trim() || submitting) return
        setSubmitting(true)
        try {
            const r = await apiFetch(`/posts/${id}/comments`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ content }),
            })
            if (r.ok) {
                const created: Comment = await r.json()
                setComments((c) => [...(c ?? []), created])
                setContent('')
                setPost((p) => (p ? { ...p, comment_count: p.comment_count + 1 } : p))
            }
        } finally {
            setSubmitting(false)
        }
    }

    if (post === null || comments === null) {
        return <div className="mx-auto w-full max-w-xl p-8">Loading…</div>
    }

    return (
        <div className="mx-auto flex w-full max-w-xl flex-col gap-8 p-8">
            <Link href="/" className="text-sm text-zinc-500 hover:underline">
                ← Back to feed
            </Link>

            <div>
                <div className="flex items-baseline gap-2">
                    <Link href={`/users/${post.username}`} className="hover:underline">
                        <Strong>@{post.username}</Strong>
                    </Link>
                    <Text className="text-xs">{timeAgo(post.created_at)}</Text>
                </div>
                <Text className="mt-2 text-lg whitespace-pre-wrap">{post.content}</Text>
                <Text className="mt-2 text-sm text-zinc-500">
                    {post.like_count} {post.like_count === 1 ? 'like' : 'likes'} ·{' '}
                    {post.comment_count} {post.comment_count === 1 ? 'comment' : 'comments'}
                </Text>
            </div>

            <Divider />

            <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-3">
                <Field>
                    <Label>Add a comment</Label>
                    <Textarea
                        name="comment"
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                    />
                </Field>
                <Button type="submit" disabled={submitting || !content.trim()}>
                    {submitting ? 'Posting…' : 'Comment'}
                </Button>
            </form>

            <div className="flex flex-col gap-4">
                {comments.length === 0 ? (
                    <Text>No comments yet. Be the first.</Text>
                ) : (
                    comments.map((c, i) => (
                        <div key={c.id}>
                            {i > 0 && <Divider className="mb-4" />}
                            <div className="flex items-baseline gap-2">
                                <Link href={`/users/${c.username}`} className="hover:underline">
                                    <Strong>@{c.username}</Strong>
                                </Link>
                                <Text className="text-xs">{timeAgo(c.created_at)}</Text>
                            </div>
                            <Text className="mt-1 whitespace-pre-wrap">{c.content}</Text>
                        </div>
                    ))
                )}
            </div>
        </div>
    )
}
