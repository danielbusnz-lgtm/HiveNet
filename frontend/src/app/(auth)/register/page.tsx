'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/button'
import { Field, Label } from '@/components/fieldset'
import { Heading } from '@/components/heading'
import { Input } from '@/components/input'
import { Strong, Text, TextLink } from '@/components/text'
import { API_URL } from '@/lib/api'

export default function Register() {
    const router = useRouter()
    const [username, setUsername] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')
    const [submitting, setSubmitting] = useState(false)

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        setError('')
        setSubmitting(true)
        try {
            const response = await fetch(`${API_URL}/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, email, password }),
            })
            const data = await response.json().catch(() => ({}))
            if (!response.ok) {
                setError(
                    typeof data.detail === 'string'
                        ? data.detail
                        : 'Could not create your account. Please try again.',
                )
                return
            }
            // Account created. Send them to sign in.
            router.push('/login')
        } catch {
            setError('Could not reach the server. Please try again.')
        } finally {
            setSubmitting(false)
        }
    }

    return (
        <form onSubmit={handleSubmit} className="grid w-full max-w-sm grid-cols-1 gap-8">
            <Heading>Create your account</Heading>
            {error && (
                <p className="text-sm text-red-600 dark:text-red-400" role="alert">
                    {error}
                </p>
            )}
            <Field>
                <Label>Username</Label>
                <Input
                    name="username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                />
            </Field>
            <Field>
                <Label>Email</Label>
                <Input
                    type="email"
                    name="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
            </Field>
            <Field>
                <Label>Password</Label>
                <Input
                    type="password"
                    name="password"
                    autoComplete="new-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
            </Field>
            <Button type="submit" disabled={submitting} className="w-full">
                {submitting ? 'Creating account…' : 'Create account'}
            </Button>
            <Text>
                Already have an account?{' '}
                <TextLink href="/login">
                    <Strong>Sign in</Strong>
                </TextLink>
            </Text>
        </form>
    )
}
