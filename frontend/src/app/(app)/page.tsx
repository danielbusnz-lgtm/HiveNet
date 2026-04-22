'use client'
import { useState } from 'react'
import { PostComposer } from '@/components/post-composer'
import { Feed } from '@/components/feed'

export default function Home() {
    const [refreshKey, setRefreshKey] = useState(0)

    return (
        <div className="mx-auto flex w-full max-w-xl flex-col gap-8 p-8">
            <PostComposer onPosted={() => setRefreshKey((k) => k + 1)} />
            <Feed refreshKey={refreshKey} />
        </div>
    )
}
