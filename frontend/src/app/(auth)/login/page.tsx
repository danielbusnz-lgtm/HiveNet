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
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault()

        const response = await fetch(`${API_URL}/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password }),
        })

        const data = await response.json()
        localStorage.setItem('token', data.access_token)
        router.push('/')
    }

    return (
        <form onSubmit={handleSubmit} className="grid w-full max-w-sm grid-cols-1 gap-8">
            <Heading>Sign in to your account</Heading>
            <Field>
                <Label>Username</Label>
                <Input
                    name="username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
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
            <Button type="submit" className="w-full">
                Login
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
