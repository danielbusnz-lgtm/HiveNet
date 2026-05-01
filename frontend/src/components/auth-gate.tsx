'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

/**
 * Wrap any subtree to require a logged-in user.
 *
 * Renders nothing while checking the token. Redirects to `/login` if no token is found,
 * otherwise renders `children`.
 */
export function AuthGate({ children }: { children: React.ReactNode }) {
    const router = useRouter()
    const [ready, setReady] = useState(false)

    useEffect(() => {
        const token = localStorage.getItem('token')
        if (!token) {
            router.replace('/login')
        } else {
            // eslint-disable-next-line react-hooks/set-state-in-effect -- localStorage is only available client-side
            setReady(true)
        }
    }, [router])

    if (!ready) return null
    return <>{children}</>
}
