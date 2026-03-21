"use client"
import { ReactNode } from "react"

type TerminalProps = {
  children: ReactNode
}

export default function Terminal({ children }: TerminalProps) {
  return (
    <div className="
      my-8
      bg-black/70
      border border-emerald-500/20
      rounded-xl
      p-5
      shadow-[0_0_30px_rgba(16,185,129,0.08)]
      overflow-x-auto
    ">
      <pre className="
        text-emerald-400
        text-[15px]
        leading-7
        font-mono
        whitespace-pre
      ">
        {children}
      </pre>
    </div>
  )
}