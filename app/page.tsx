import type { Metadata } from "next"
import { Landing } from "@/features/demo/landing"

export const metadata: Metadata = {
  title: "Accountbook",
  description: "Your business, AI-powered and always clear. Ask Claude in natural language and get instant answers from your live data through MCP.",
}

export default function HomePage() {
  return <Landing />
}
