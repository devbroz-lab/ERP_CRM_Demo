import type { Metadata } from "next"
import { DemoDesk } from "@/features/demo/demo-desk"

export const metadata: Metadata = {
  title: "Demo",
  description: "A walkthrough of inventory, customers, vendors, quotes, and an assistant reading the same records.",
}

export default function HomePage() {
  return <DemoDesk />
}
