"use client"

import { useEffect, useLayoutEffect, useRef, useState } from "react"
import {
  FileText,
  MessageSquare,
  Package,
  Pause,
  Play,
  ShoppingCart,
  Users,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn, formatCurrency } from "@/lib/utils"
import {
  LOW_AT,
  SAMPLE_DAY_LABEL,
  assignments,
  beats,
  connectorTools,
  customers,
  lateAssignments,
  lowStock,
  productLink,
  products,
  quote,
  reading,
  vendors,
  type BeatId,
} from "@/features/demo/studio"
import { STORY_HOLD_MS, storyCues } from "@/features/demo/story"

const navIcons: Record<BeatId, typeof Package> = {
  stock: Package,
  people: Users,
  quote: FileText,
  floor: ShoppingCart,
  ask: MessageSquare,
}

export function DemoDesk() {
  const [manualStep, setManualStep] = useState(0)
  const [playing, setPlaying] = useState(false)
  const [playhead, setPlayhead] = useState<number | null>(null)
  const [shown, setShown] = useState(0)
  const [typing, setTyping] = useState(true)
  const shownRef = useRef(0)
  const threadEndRef = useRef<HTMLDivElement>(null)

  const inStory = playhead !== null
  const cue = inStory ? storyCues[playhead] : null
  const step = cue ? cue.step : manualStep
  const questions = cue ? cue.questions : manualStep + 1
  const answers = cue ? cue.answers : shown
  const beat = beats[step]
  const atEnd = playhead !== null && playhead >= storyCues.length - 1

  useEffect(() => {
    if (inStory) return
    if (manualStep < shownRef.current) {
      setTyping(false)
      return
    }

    setTyping(true)
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    const timer = window.setTimeout(() => {
      shownRef.current = manualStep + 1
      setShown(manualStep + 1)
      setTyping(false)
    }, reduce ? 0 : 700)

    return () => window.clearTimeout(timer)
  }, [manualStep, inStory])

  useEffect(() => {
    if (!playing || playhead === null) return
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    const timer = window.setTimeout(() => {
      if (playhead >= storyCues.length - 1) {
        setPlaying(false)
        return
      }
      setPlayhead(playhead + 1)
    }, reduce ? 700 : STORY_HOLD_MS)

    return () => window.clearTimeout(timer)
  }, [playing, playhead])

  useEffect(() => {
    if (inStory) return
    threadEndRef.current?.scrollIntoView({ block: "nearest" })
  }, [manualStep, shown, typing, inStory])

  function leaveStory(nextStep: number) {
    setPlaying(false)
    setPlayhead(null)
    shownRef.current = nextStep + 1
    setShown(nextStep + 1)
    setTyping(false)
    setManualStep(nextStep)
  }

  useEffect(() => {
    function onKey(event: KeyboardEvent) {
      if (event.key !== "ArrowRight" && event.key !== "ArrowLeft") return
      const base = playhead !== null ? storyCues[playhead].step : manualStep
      const next = event.key === "ArrowRight" ? Math.min(beats.length - 1, base + 1) : Math.max(0, base - 1)
      leaveStory(next)
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [manualStep, playhead])

  function openChapter(index: number) {
    leaveStory(index)
  }

  function togglePlay() {
    if (playing) {
      setPlaying(false)
      return
    }
    if (playhead === null || atEnd) setPlayhead(0)
    setPlaying(true)
  }

  return (
    <div
      className="demo-studio flex min-h-dvh flex-col lg:h-dvh lg:overflow-hidden"
      style={{
        backgroundImage:
          "radial-gradient(circle, oklch(0.78 0.04 68 / 0.55) 1px, transparent 1px)",
        backgroundSize: "22px 22px",
      }}
    >
      <header className="flex h-14 shrink-0 items-center justify-between border-b border-border/60 bg-background/80 px-4 backdrop-blur-md md:px-6">
        <p className="text-sm font-medium tracking-wide">Demo</p>
        <p className="font-mono text-[11px] text-muted-foreground">{SAMPLE_DAY_LABEL}</p>
      </header>

      <main className="mx-auto grid w-full max-w-[1440px] flex-1 gap-3 p-3 min-h-0 md:p-4 lg:grid-cols-[228px_minmax(0,1fr)_minmax(280px,340px)]">
        <aside className="flex flex-col gap-3 lg:min-h-0">
          <div className="flex gap-2 overflow-x-auto pb-1 [scrollbar-width:none] lg:flex-1 lg:flex-col lg:overflow-visible lg:pb-0 [&::-webkit-scrollbar]:hidden">
            {beats.map((chapter, index) => {
              const active = index === step
              return (
                <button
                  key={chapter.id}
                  type="button"
                  data-spot={`chapter-${chapter.id}`}
                  onClick={() => openChapter(index)}
                  aria-current={active ? "step" : undefined}
                  className={cn(
                    "shrink-0 rounded-xl border px-3 py-3 text-left lg:w-full",
                    active
                      ? "border-primary bg-primary text-primary-foreground shadow-sm"
                      : "border-border/70 bg-card/80 text-foreground hover:bg-accent/60"
                  )}
                >
                  <span
                    className={cn(
                      "font-mono text-[10px] tracking-[0.16em]",
                      active ? "text-primary-foreground/70" : "text-muted-foreground"
                    )}
                  >
                    {chapter.kicker}
                  </span>
                  <span className="mt-0.5 block text-sm font-medium">{chapter.title}</span>
                  <span
                    className={cn(
                      "mt-0.5 hidden text-xs lg:block",
                      active ? "text-primary-foreground/75" : "text-muted-foreground"
                    )}
                  >
                    {chapter.blurb}
                  </span>
                </button>
              )
            })}
          </div>
          <div className="shrink-0 space-y-1.5">
            <Button
              type="button"
              variant={playing ? "outline" : "default"}
              className="w-full"
              onClick={togglePlay}
            >
              {playing ? <Pause /> : <Play />}
              {playing ? "Pause" : atEnd ? "Replay" : playhead !== null ? "Resume" : "Play story"}
              {inStory && (
                <span className="font-mono text-[10px] opacity-70">
                  {playhead + 1}/{storyCues.length}
                </span>
              )}
            </Button>
            {cue && (
              <p className="px-1 text-[11px] leading-snug text-muted-foreground">
                {playing ? "Now" : "Paused"} · {cue.title}
              </p>
            )}
          </div>
        </aside>

        <section className="flex min-h-0 flex-col gap-2">
          <div className="flex min-h-[540px] flex-col overflow-hidden rounded-2xl border border-border/70 bg-card shadow-xl shadow-black/[0.05] lg:min-h-0 lg:flex-1">
            <div className="flex h-11 shrink-0 items-center gap-3 border-b border-border/60 px-3">
              <span className="flex gap-1.5" aria-hidden>
                <span className="size-2.5 rounded-full bg-[#c4a574]" />
                <span className="size-2.5 rounded-full bg-[#8aa890]" />
                <span className="size-2.5 rounded-full bg-[#8aa0b5]" />
              </span>
              <span className="text-xs text-muted-foreground">Demo</span>
              <span className="ml-auto font-mono text-[11px] text-muted-foreground">{SAMPLE_DAY_LABEL}</span>
            </div>
            <div className="flex min-h-0 flex-1">
              <nav className="hidden w-12 shrink-0 flex-col gap-1 border-r border-border/60 p-1.5 sm:flex lg:w-[132px] lg:p-2">
                {beats.map((chapter, index) => {
                  const Icon = navIcons[chapter.id]
                  const active = index === step
                  return (
                    <button
                      key={chapter.id}
                      type="button"
                      data-spot={`nav-${chapter.id}`}
                      onClick={() => openChapter(index)}
                      className={cn(
                        "flex items-center justify-center gap-2 rounded-lg px-2 py-2 text-xs font-medium lg:justify-start",
                        active
                          ? "bg-primary text-primary-foreground"
                          : "text-muted-foreground hover:bg-accent/60 hover:text-foreground"
                      )}
                    >
                      <Icon className="size-4 shrink-0" />
                      <span className="hidden lg:inline">{chapter.nav}</span>
                    </button>
                  )
                })}
              </nav>
              <div key={beat.id} className="min-w-0 flex-1 overflow-auto animate-in fade-in duration-300">
                {beat.id === "stock" && <StockView />}
                {beat.id === "people" && <PeopleView />}
                {beat.id === "quote" && <QuoteView />}
                {beat.id === "floor" && <FloorView />}
                {beat.id === "ask" && <AskView />}
              </div>
            </div>
          </div>
          <p className="px-1 text-xs text-muted-foreground">{beat.caption}</p>
        </section>

        <section className="flex min-h-[420px] flex-col overflow-hidden rounded-2xl border border-border/70 bg-card shadow-xl shadow-black/[0.05] lg:min-h-0">
          <div className="flex h-11 shrink-0 items-center justify-between border-b border-border/60 px-4">
            <p className="text-sm font-medium">Ask the company</p>
            <span className="text-[11px] text-muted-foreground">Scripted</span>
          </div>
          <div className="flex-1 space-y-4 overflow-auto px-4 py-4" aria-live="polite">
            {questions === 0 && (
              <p className="text-xs leading-relaxed text-muted-foreground">
                The questions start once the stock is on screen.
              </p>
            )}
            {beats.slice(0, questions).map((chapter, index) => (
              <div key={chapter.id} className="space-y-3">
                <Bubble from="You" spot={index === questions - 1 ? "chat-ask" : undefined}>
                  {chapter.question}
                </Bubble>
                {index < answers && (
                  <Bubble from="Assistant" spot={index === questions - 1 ? "chat-answer" : undefined}>
                    {chapter.answer}
                  </Bubble>
                )}
              </div>
            ))}
            {(inStory ? answers < questions : typing && shown <= manualStep) && (
              <p className="text-xs text-muted-foreground">Reading the records…</p>
            )}
            <div ref={threadEndRef} />
          </div>
          <p className="border-t border-border/60 px-4 py-3 text-[11px] leading-relaxed text-muted-foreground">
            Replies come from the records on screen. Claude, or any other assistant, connects the same way.
          </p>
        </section>
      </main>
      {cue && (
        <StoryTip
          key={cue.id}
          spot={cue.spot}
          title={cue.title}
          body={cue.body}
          index={playhead ?? 0}
          total={storyCues.length}
        />
      )}
    </div>
  )
}

function Bubble({
  from,
  children,
  spot,
}: {
  from: "You" | "Assistant"
  children: string
  spot?: string
}) {
  const mine = from === "You"
  return (
    <div data-spot={spot} className={cn("flex flex-col gap-1", mine ? "items-end" : "items-start")}>
      <span className="px-1 text-[10px] uppercase tracking-[0.14em] text-muted-foreground">{from}</span>
      <p
        className={cn(
          "max-w-[95%] rounded-2xl px-3 py-2 text-[13px] leading-relaxed",
          mine
            ? "rounded-br-md bg-primary text-primary-foreground"
            : "rounded-bl-md border border-border/70 bg-background/70"
        )}
      >
        {children}
      </p>
    </div>
  )
}

function StockView() {
  return (
    <div className="space-y-4 p-4 md:p-5">
      <ViewTitle kicker="Products" title="On hand" />
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
        <Stat value={String(products.length)} label="Products" />
        <Stat value="3" label="Categories" />
        <Stat value={String(customers.length)} label="Customers" />
        <Stat value={String(lowStock.length)} label="Under 20" warn spot="low-count" />
      </div>
      <div className="divide-y divide-border/60 overflow-hidden rounded-xl border border-border/70">
        {products.map((product) => {
          const low = product.onHand < LOW_AT
          return (
            <div
              key={product.sku}
              data-spot={
                product.sku === "SKU-002" ? "low-p2" : product.sku === "SKU-006" ? "low-p6" : undefined
              }
              className={cn(
                "flex items-center gap-3 px-3 py-2.5",
                low && "bg-[#f3e6c8]"
              )}
            >
              <span className="w-14 shrink-0 font-mono text-[11px] text-muted-foreground">{product.sku}</span>
              <span className="min-w-0 flex-1">
                <span className="block truncate text-sm">{product.name}</span>
                <span className="block text-[11px] text-muted-foreground">{product.category}</span>
              </span>
              <span className="text-right">
                <span
                  className={cn(
                    "block text-sm font-medium tabular-nums",
                    low && "text-[#8a5a12]"
                  )}
                >
                  {product.onHand}
                </span>
                <span className="block text-[10px] text-muted-foreground">{low ? "Low" : "On hand"}</span>
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}

function PeopleView() {
  return (
    <div className="space-y-4 p-4 md:p-5">
      <ViewTitle kicker="Customers" title="Customer and vendor" />
      <div data-spot="product-link" className="rounded-xl border border-border/70 bg-background/50 p-4">
        <p className="font-mono text-[11px] text-muted-foreground">{productLink.product.sku}</p>
        <p className="mt-1 text-base font-medium">{productLink.product.name}</p>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <div>
            <p className="text-[11px] uppercase tracking-[0.14em] text-muted-foreground">Customer</p>
            <p className="mt-1 text-sm font-medium">{productLink.customer.name}</p>
            <p className="text-xs text-muted-foreground">
              {productLink.customer.account} · {productLink.customerSku} ·{" "}
              {formatCurrency(productLink.price, productLink.currency)} · {productLink.customer.terms}
            </p>
          </div>
          <div>
            <p className="text-[11px] uppercase tracking-[0.14em] text-muted-foreground">Vendor</p>
            <p className="mt-1 text-sm font-medium">{productLink.vendor.name}</p>
            <p className="text-xs text-muted-foreground">
              {productLink.vendor.code} · Supplies {productLink.vendor.category}
            </p>
          </div>
        </div>
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        <NameList
          title="Customers"
          rows={customers.map((customer) => ({
            title: customer.name,
            detail: `${customer.account} · ${customer.currency} · ${customer.terms}`,
          }))}
        />
        <NameList
          title="Vendors"
          rows={vendors.map((vendor) => ({
            title: vendor.name,
            detail: `${vendor.code} · Supplies ${vendor.category}`,
          }))}
        />
      </div>
    </div>
  )
}

function QuoteView() {
  return (
    <div className="p-4 md:p-5">
      <div data-spot="quote-doc" className="rounded-xl border border-border/70 p-4 md:p-5">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="font-mono text-sm">{quote.number}</p>
            <p className="mt-1 text-base font-medium">{quote.customer}</p>
            <p className="text-xs text-muted-foreground">{quote.terms}</p>
          </div>
          <Pill status={quote.status} />
        </div>
        <div className="mt-4 divide-y divide-border/60 border-y border-border/60">
          {quote.lines.map((line) => (
            <div key={line.sku} className="flex items-center gap-3 py-3">
              <span className="min-w-0 flex-1">
                <span className="block truncate text-sm">{line.name}</span>
                <span className="font-mono text-[11px] text-muted-foreground">{line.sku}</span>
              </span>
              <span className="text-xs tabular-nums text-muted-foreground">×{line.qty}</span>
              <span className="w-24 text-right text-sm font-medium tabular-nums">
                {formatCurrency(line.price * line.qty, line.currency)}
              </span>
            </div>
          ))}
        </div>
        <div data-spot="quote-total" className="mt-3 flex items-baseline justify-between">
          <p className="text-xs text-muted-foreground">Valid through {quote.validUntil}</p>
          <p className="text-lg font-semibold tabular-nums">{formatCurrency(quote.total, quote.currency)}</p>
        </div>
        <p className="mt-3 text-xs text-muted-foreground">
          If the customer accepts, these lines become order {quote.becomes}.
        </p>
      </div>
    </div>
  )
}

function FloorView() {
  const orders = ["O-2026-2001", "O-2026-2002"]
  return (
    <div className="space-y-4 p-4 md:p-5">
      <ViewTitle kicker="Orders" title="Assignments on the floor" />
      {orders.map((orderNumber) => {
        const jobs = assignments.filter((job) => job.order === orderNumber)
        return (
          <section key={orderNumber}>
            <div className="mb-2 flex items-baseline justify-between gap-2">
              <p className="font-mono text-sm">{orderNumber}</p>
              <p className="truncate text-xs text-muted-foreground">{jobs[0]?.customer}</p>
            </div>
            <div className="space-y-2">
              {jobs.map((job) => {
                const isLate = lateAssignments.includes(job)
                return (
                  <div
                    key={`${job.vendor}-${job.due}-${job.qty}`}
                    data-spot={
                      job.vendor === "Vendor 1" && isLate
                        ? "late-v1"
                        : job.vendor === "Vendor 4" && job.status === "in_progress"
                          ? "late-v4"
                          : undefined
                    }
                    className={cn(
                      "flex items-center gap-3 rounded-xl border border-border/70 px-3 py-2.5",
                      isLate && "border-[#d7b56a] bg-[#f3e6c8]"
                    )}
                  >
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-sm">{job.vendor}</span>
                      <span className="block truncate text-[11px] text-muted-foreground">
                        {job.qty} · {job.item} · due {job.dueLabel}
                      </span>
                    </span>
                    {isLate && (
                      <span className="text-[11px] font-medium text-[#8a5a12]">Late</span>
                    )}
                    <Pill status={job.status} />
                  </div>
                )
              })}
            </div>
          </section>
        )
      })}
    </div>
  )
}

function AskView() {
  return (
    <div className="space-y-4 p-4 md:p-5">
      <ViewTitle kicker="Connector" title="Reading these records" />
      <div data-spot="connector" className="flex flex-wrap gap-1.5">
        {connectorTools.map((tool) => (
          <span
            key={tool}
            className="rounded-full border border-border/80 bg-background/70 px-2.5 py-1 text-[11px]"
          >
            {tool}
          </span>
        ))}
      </div>
      <ul data-spot="reading" className="divide-y divide-border/60 overflow-hidden rounded-xl border border-border/70">
        {reading.map((line) => (
          <li key={line} className="px-3 py-2.5 text-sm">
            {line}
          </li>
        ))}
      </ul>
      <p className="text-xs leading-relaxed text-muted-foreground">
        Claude, or any other assistant, connects here and asks in plain language. This page keeps
        the answers fixed so a client always sees the same studio.
      </p>
    </div>
  )
}

function ViewTitle({ kicker, title }: { kicker: string; title: string }) {
  return (
    <div>
      <p className="text-[11px] uppercase tracking-[0.16em] text-muted-foreground">{kicker}</p>
      <h2 className="mt-1 [font-family:var(--font-display)] text-2xl leading-none tracking-tight">{title}</h2>
    </div>
  )
}

function Stat({
  value,
  label,
  warn,
  spot,
}: {
  value: string
  label: string
  warn?: boolean
  spot?: string
}) {
  return (
    <div
      data-spot={spot}
      className={cn(
        "rounded-xl border border-border/70 bg-background/40 px-3 py-2.5",
        warn && "border-[#d7b56a] bg-[#f3e6c8]"
      )}
    >
      <p className={cn("text-lg font-semibold tabular-nums", warn && "text-[#8a5a12]")}>
        {value}
      </p>
      <p className="text-[11px] text-muted-foreground">{label}</p>
    </div>
  )
}

function Pill({ status }: { status: string }) {
  const styles: Record<string, string> = {
    sent: "bg-[#B8C8D8] text-[#1E2E3E] border-[#2C3E50]",
    assigned: "bg-[#B8C8D8] text-[#1E2E3E] border-[#2C3E50]",
    pending: "bg-[#E8D5A0] text-[#6B4A10] border-[#B08A3E]",
    in_progress: "bg-[#E8D5A0] text-[#6B4A10] border-[#B08A3E]",
    completed: "bg-[#C8DDD0] text-[#2E5040] border-[#4A6B54]",
  }
  const label = status === "in_progress" ? "In progress" : status.charAt(0).toUpperCase() + status.slice(1)

  return (
    <span className={cn("inline-flex shrink-0 items-center rounded-md border px-2 py-0.5 text-[11px] font-medium", styles[status])}>
      {label}
    </span>
  )
}

function StoryTip({
  spot,
  title,
  body,
  index,
  total,
}: {
  spot: string
  title: string
  body: string
  index: number
  total: number
}) {
  const tipRef = useRef<HTMLDivElement>(null)
  const [box, setBox] = useState<{ top: number; left: number; width: number; height: number } | null>(null)
  const [tip, setTip] = useState<{ top: number; left: number } | null>(null)

  useLayoutEffect(() => {
    const target = document.querySelector(`[data-spot="${spot}"]`)
    if (!target) return

    target.scrollIntoView({ block: "nearest", inline: "nearest" })

    let frame = 0
    const tick = () => {
      const rect = target.getBoundingClientRect()
      setBox((prev) => {
        if (
          prev &&
          Math.abs(prev.top - rect.top) < 0.5 &&
          Math.abs(prev.left - rect.left) < 0.5 &&
          Math.abs(prev.width - rect.width) < 0.5 &&
          Math.abs(prev.height - rect.height) < 0.5
        ) {
          return prev
        }
        return { top: rect.top, left: rect.left, width: rect.width, height: rect.height }
      })
      frame = window.requestAnimationFrame(tick)
    }

    frame = window.requestAnimationFrame(tick)
    return () => window.cancelAnimationFrame(frame)
  }, [spot])

  useLayoutEffect(() => {
    if (!box || !tipRef.current) return
    const tipWidth = tipRef.current.offsetWidth
    const tipHeight = tipRef.current.offsetHeight
    const gap = 12
    const margin = 16
    const preferLeft = box.left > window.innerWidth * 0.62
    const sides = preferLeft ? (["left", "bottom", "right", "top"] as const) : (["right", "bottom", "left", "top"] as const)

    const targetRight = box.left + box.width
    const targetBottom = box.top + box.height
    let placed: { top: number; left: number } | null = null
    for (const side of sides) {
      let top = box.top + box.height / 2 - tipHeight / 2
      let left = box.left
      if (side === "right") left = targetRight + gap
      if (side === "left") left = box.left - tipWidth - gap
      if (side === "bottom") {
        top = targetBottom + gap
        left = Math.min(box.left, window.innerWidth - tipWidth - margin)
      }
      if (side === "top") {
        top = box.top - tipHeight - gap
        left = Math.min(box.left, window.innerWidth - tipWidth - margin)
      }
      const tipRight = left + tipWidth
      const tipBottom = top + tipHeight
      const fits =
        left >= margin &&
        top >= margin &&
        tipRight <= window.innerWidth - margin &&
        tipBottom <= window.innerHeight - margin
      const coversTarget = left < targetRight && tipRight > box.left && top < targetBottom && tipBottom > box.top
      if (fits && !coversTarget) {
        placed = { top, left }
        break
      }
    }

    setTip(
      placed ?? {
        top: Math.max(margin, Math.min(box.top + box.height + gap, window.innerHeight - tipHeight - margin)),
        left: Math.max(margin, Math.min(box.left, window.innerWidth - tipWidth - margin)),
      }
    )
  }, [box, title, body])

  return (
    <>
      {box && (
        <div
          className="pointer-events-none fixed z-40 rounded-xl ring-2 ring-primary"
          style={{ top: box.top - 3, left: box.left - 3, width: box.width + 6, height: box.height + 6 }}
        />
      )}
      <div
        ref={tipRef}
        role="status"
        className="pointer-events-none fixed z-50 w-[260px] rounded-xl bg-primary px-3.5 py-3 text-primary-foreground shadow-xl"
        style={{ top: tip?.top ?? 16, left: tip?.left ?? 16, visibility: tip ? "visible" : "hidden" }}
      >
        <p className="font-mono text-[10px] tracking-[0.16em] text-primary-foreground/70">
          {index + 1} of {total}
        </p>
        <p className="mt-1 text-sm font-medium">{title}</p>
        <p className="mt-1 text-xs leading-relaxed text-primary-foreground/80">{body}</p>
      </div>
    </>
  )
}

function NameList({ rows, title }: { title: string; rows: { title: string; detail: string }[] }) {
  return (
    <div>
      <p className="mb-1.5 text-[11px] uppercase tracking-[0.14em] text-muted-foreground">{title}</p>
      <div className="divide-y divide-border/60 overflow-hidden rounded-xl border border-border/70">
        {rows.map((row) => (
          <div key={row.title} className="px-3 py-2">
            <p className="text-sm">{row.title}</p>
            <p className="text-[11px] text-muted-foreground">{row.detail}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
