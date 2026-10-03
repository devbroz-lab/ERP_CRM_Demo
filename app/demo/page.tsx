import type { Metadata } from "next"
import { connection } from "next/server"
import { DemoDesk } from "@/features/demo/demo-desk"
import { createDemo } from "@/features/demo/studio"

export const metadata: Metadata = {
  title: "Accountbook",
  description: "Customers, quotes, orders, and vendors in one book.",
}

export default async function DemoPage() {
  await connection()
  return <DemoDesk demo={createDemo(new Date())} />
}
