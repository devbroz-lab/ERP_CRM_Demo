import type { Metadata } from "next"
import { Landing } from "@/features/demo/landing"

export const metadata: Metadata = {
  title: "Accountbook",
  description: "The customer account and the order in one book, connected to Claude through MCP.",
}

export default function HomePage() {
  return <Landing />
}
