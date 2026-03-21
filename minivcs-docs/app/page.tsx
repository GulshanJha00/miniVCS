"use client"
import Terminal from "@/components/Terminal"
import { useRouter } from "next/navigation"
import { useEffect } from "react";

export default function Home() {
  const router = useRouter();
useEffect(() => {
    router.push("/docs")
}, [])

  return (
    <div>
      <h1 className="text-5xl font-bold mb-6">
        miniVCS
      </h1>

      <p className="text-zinc-400 text-xl mb-6">
        Lightweight Version Control System with S3 remote support.
      </p>

      <Terminal>
npm install -g minivcs
      </Terminal>

      <Terminal>
minivcs init
minivcs add .
minivcs commit "first commit"
      </Terminal>
    </div>
  )
}