'use client'
import { apiFetch } from '@/lib/api'
import { useEffect, useState } from 'react'


export default function UserProfilePage({ params }: { params: { username: string } }) {
    const [user, setUser] = useState(null)
    useEffect(() => {
        apiFetch(`/users/${params.username}`)
            .then((r) => r.json())
            .then((data) => setUser(data))
    }, [])

    return <div>Hello, @{params.username}</div>

}



