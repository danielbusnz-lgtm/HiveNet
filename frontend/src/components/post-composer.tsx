'use client'
import { useState } from 'react'
import { Button } from '@/components/button'
import { Field, Label } from '@/components/fieldset'
import { Textarea } from '@/components/textarea'
import { API_URL } from '@/lib/api'

/**
 * Textarea + submit button for creating a new post.
 *
 * @param onPosted - Optional callback fired after a successful post (e.g., to refresh the feed).
 */
export function PostComposer({ onPosted }: { onPosted?: () => void }) {
    const [content, setContent] = useState('')

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault()

        const token = localStorage.getItem('token')

        const response = await fetch(`${API_URL}/posts`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ content }),
        })

        if (response.ok) {
            setContent('')
            onPosted?.()
        }
    }

    return (
        <form onSubmit={handleSubmit} className="grid w-full max-w-xl grid-cols-1 gap-4">
            <Field>
                <Label>What&apos;s on your mind?</Label>
                <Textarea
                    name="content"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                />
            </Field>
            <Button type="submit">Post</Button>
        </form>
    )
}
