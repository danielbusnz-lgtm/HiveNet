'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/button'
import { Checkbox, CheckboxField } from '@/components/checkbox'
import { Field, Label } from '@/components/fieldset'
import { Heading } from '@/components/heading'
import { Input } from '@/components/input'
import { Strong, Text, TextLink } from '@/components/text'
import { API_URL } from '@/lib/api'

export default function Login() {
    const router = useRouter()
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')
    const [submitting, setSubmitting] = useState(false)

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        setError('')
        setSubmitting(true)
        try {
            const response = await fetch(`${API_URL}/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            })
            const data = await response.json().catch(() => ({}))
            if (!response.ok) {
                setError(
                    typeof data.detail === 'string'
                        ? data.detail
                        : 'Login failed. Check your email and password.',
                )
                return
            }
            localStorage.setItem('token', data.access_token)
            router.push('/')
        } catch {
            setError('Could not reach the server. Please try again.')
        } finally {
            setSubmitting(false)
        }
    }

    return (
        <form onSubmit={handleSubmit} className="grid w-full max-w-sm grid-cols-1 gap-8">
            <Heading>Sign in to your account</Heading>
            {error && (
                <p className="text-sm text-red-600 dark:text-red-400" role="alert">
                    {error}
                </p>
            )}
            <Field>
                <Label>Email</Label>
                <Input
                    type="email"
                    name="email"
                    autoComplete="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
            </Field>
            <Field>
                <Label>Password</Label>
                <Input
                    type="password"
                    name="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
            </Field>
            <div className="flex items-center justify-between">
                <CheckboxField>
                    <Checkbox name="remember" />
                    <Label>Remember me</Label>
                </CheckboxField>
                <Text>
                    <TextLink href="/forgot-password">
                        <Strong>Forgot password?</Strong>
                    </TextLink>
                </Text>
            </div>
            <Button type="submit" disabled={submitting} className="w-full">
                {submitting ? 'Signing in…' : 'Login'}
            </Button>
            <Text>
                Don’t have an account?{' '}
                <TextLink href="/register">
                    <Strong>Sign up</Strong>
                </TextLink>
            </Text>
        </form>
    )
}
