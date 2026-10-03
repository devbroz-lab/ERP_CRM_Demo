"use client"

import Link from "next/link"
import { useEffect } from "react"

const edge = { borderColor: "rgba(255,255,255,0.12)" }

const notes = [
  {
    title: "One book for the business",
    body: "Customer accounts, quotes, orders, and vendors live in the same place. That is the CRM and the ERP together.",
  },
  {
    title: "The account is the record",
    body: "Who buys, on what terms, and which order is open. Nothing is copied into a second report.",
  },
  {
    title: "What is still open",
    body: "A quote that has not been accepted, and a vendor delivery that is late, sit on the account.",
  },
]

export function Landing() {
  useEffect(() => {
    const html = document.documentElement
    const body = document.body
    const previousHtml = html.style.backgroundColor
    const previousBody = body.style.backgroundColor
    const previousScheme = html.style.colorScheme
    html.style.backgroundColor = "#0a0a0a"
    body.style.backgroundColor = "#0a0a0a"
    html.style.colorScheme = "dark"
    return () => {
      html.style.backgroundColor = previousHtml
      body.style.backgroundColor = previousBody
      html.style.colorScheme = previousScheme
    }
  }, [])

  return (
    <div
      className="min-h-dvh bg-[#0a0a0a] text-white"
      style={{
        backgroundImage:
          "radial-gradient(ellipse 80% 50% at 50% -10%, rgba(255,20,147,0.22), transparent 55%), radial-gradient(ellipse 50% 40% at 100% 0%, rgba(75,0,130,0.45), transparent 50%)",
      }}
    >
      <header className="mx-auto flex h-16 w-full max-w-5xl items-center px-5 md:px-8">
        <p className="text-sm font-semibold tracking-tight">Accountbook</p>
      </header>

      <main className="mx-auto w-full max-w-5xl px-5 pb-20 md:px-8">
        <p className="text-xs font-medium uppercase tracking-[0.22em] text-[#ff69b4]">Accountbook</p>
        <h1 className="mt-4 max-w-3xl text-4xl font-semibold leading-[1.05] tracking-tight md:text-6xl">
          An{" "}
          <span className="bg-gradient-to-r from-[#ff1493] via-[#8A2BE2] to-[#4b0082] bg-clip-text text-transparent">
            AI-enabled
          </span>{" "}
          account book for your customer accounts.
        </h1>
        <p className="mt-6 max-w-2xl text-base leading-relaxed text-[#a1a1aa] md:text-lg">
          Manage who you sell to, the terms they buy on, and the orders on each account.
        </p>

        <div className="mt-12 grid gap-4 md:grid-cols-3">
          {notes.map((note) => (
            <section
              key={note.title}
              className="rounded-2xl border bg-[#121212] px-5 py-5"
              style={edge}
            >
              <h2 className="text-base font-medium">{note.title}</h2>
              <p className="mt-2 text-sm leading-relaxed text-[#a1a1aa]">{note.body}</p>
            </section>
          ))}
        </div>

        <p className="mt-14 max-w-2xl text-base leading-relaxed text-[#a1a1aa] md:text-lg">
          The same book is open to AI. Claude can ask what is open, what a quote totals, and which
          delivery is late.
        </p>

        <figure className="mt-6">
          <div
            className="flex aspect-video flex-col items-center justify-center rounded-3xl border bg-[#121212]"
            style={edge}
            role="img"
            aria-label="Placeholder for a demo video"
          >
            <span className="grid size-16 place-items-center rounded-full bg-gradient-to-br from-[#ff1493] to-[#4b0082] text-white shadow-[0_0_40px_rgba(255,20,147,0.35)]">
              <svg viewBox="0 0 24 24" className="ml-1 size-6 fill-current" aria-hidden="true">
                <path d="M8 5.5v13l11-6.5-11-6.5z" />
              </svg>
            </span>
            <figcaption className="mt-5 text-sm font-medium">Demo video</figcaption>
            <p className="mt-1 text-xs text-[#a1a1aa]">A film of the tool goes here.</p>
          </div>
        </figure>

        <section className="mt-14 max-w-2xl">
          <p className="text-xs font-medium uppercase tracking-[0.22em] text-[#ff69b4]">The connection</p>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight">Claude, through MCP</h2>
          <p className="mt-4 text-base leading-relaxed text-[#a1a1aa]">
            MCP is how Claude reaches the accounts. It asks in plain language and gets the figure
            from the book: what is running low, who buys a product, what a quote totals, which
            vendor delivery is late.
          </p>
        </section>

        <section
          className="mt-16 overflow-hidden rounded-3xl border bg-[#121212] px-6 py-14 text-center md:px-12"
          style={edge}
        >
          <p className="text-xs font-medium uppercase tracking-[0.22em] text-[#ff6b35]">The tool</p>
          <h2 className="mx-auto mt-3 max-w-xl text-3xl font-semibold tracking-tight md:text-5xl">
            Open the walkthrough
          </h2>
          <p className="mx-auto mt-4 max-w-md text-sm leading-relaxed text-[#a1a1aa] md:text-base">
            Customers, quotes, orders, and the vendors who supply them.
          </p>
          <Link
            href="/demo"
            className="mt-8 inline-flex h-14 items-center rounded-full bg-[#ff1493] px-10 text-base font-semibold text-white shadow-[0_0_48px_rgba(255,20,147,0.45)] hover:bg-[#ff69b4]"
          >
            Open the tool
          </Link>
        </section>
      </main>
    </div>
  )
}
