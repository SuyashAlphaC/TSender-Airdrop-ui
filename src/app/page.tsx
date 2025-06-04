"use client"

import dynamic from "next/dynamic"

const HomeContent = dynamic(() => import("@/components/homeContent"), {
    ssr: false,
})

export default function Home() {
    return <HomeContent />
}