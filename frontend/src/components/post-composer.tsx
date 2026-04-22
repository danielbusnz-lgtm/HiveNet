'use client'
import { useState } from 'react'
import { Button } from '@/components/button'
import { Field, Label } from '@/components/fieldset'
import { Textarea } from '@/components/textarea'

export function PostComposer() {
    const [content, setContent] = useState('')

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault()

        const token = localStorage.getItem('token')

        const response = await fetch('http://localhost:8000/posts', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify({ content }),
        })

        if (response.ok) {
            setContent('')
        }
    }

    return (
        <form onSubmit={handleSubmit} className="grid w-full max-w-xl grid-cols-1 gap-4">
            <Field>
                <Label>What's on your mind?</Label>
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
