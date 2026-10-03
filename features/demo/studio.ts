import { formatCurrency } from "@/lib/utils"

/**
 * Dummy records for the public demo.
 * Nothing here is loaded from the database.
 *
 * Due dates are stored relative to 21 Aug 2026, then shifted onto today's
 * calendar so the same jobs stay late, upcoming, or finished.
 */

const ANCHOR_ISO = "2026-08-21"

function parseISODate(iso: string) {
  const [year, month, day] = iso.split("-").map(Number)
  return new Date(year, month - 1, day)
}

function formatISODate(date: Date) {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, "0")
  const day = String(date.getDate()).padStart(2, "0")
  return `${year}-${month}-${day}`
}

function formatDay(date: Date, withYear: boolean) {
  return new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "short",
    ...(withYear ? { year: "numeric" as const } : {}),
  }).format(date)
}

function calendarFrom(now: Date) {
  const asOf = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  const shiftDays = Math.round((asOf.getTime() - parseISODate(ANCHOR_ISO).getTime()) / 86_400_000)

  function shiftISO(iso: string) {
    const date = parseISODate(iso)
    date.setDate(date.getDate() + shiftDays)
    return date
  }

  return {
    asOfLabel: formatDay(asOf, true),
    sampleDay: formatISODate(asOf),
    shiftISO,
  }
}

export const LOW_AT = 20

export const products = [
  { sku: "LIP-014", name: "Velvet Matte Lipstick", category: "Makeup", onHand: 42 },
  { sku: "SER-208", name: "Hydra Glow Serum", category: "Skincare", onHand: 18 },
  { sku: "SHP-033", name: "Silk Repair Shampoo", category: "Hair", onHand: 120 },
  { sku: "SPF-110", name: "Daily Mineral SPF", category: "Skincare", onHand: 64 },
  { sku: "MSK-077", name: "Rose Clay Mask", category: "Skincare", onHand: 30 },
  { sku: "OIL-019", name: "Neroli Body Oil", category: "Body", onHand: 9 },
  { sku: "FND-052", name: "Soft Focus Foundation", category: "Makeup", onHand: 22 },
]

export const categoryCount = new Set(products.map((product) => product.category)).size

export const lowStock = products.filter((product) => product.onHand < LOW_AT)

export const customers = [
  { name: "The Glow Edit", account: "GLW-4410", currency: "USD", terms: "Net 30" },
  { name: "Marlowe Apothecary", account: "MAR-2280", currency: "USD", terms: "Net 45" },
  { name: "Bloom & Birch", account: "BLB-1194", currency: "USD", terms: "Net 30" },
]

export const vendors = [
  { name: "Atelier Forme", code: "ATL-01", category: "Makeup" },
  { name: "Northline Labs", code: "NTL-02", category: "Skincare" },
  { name: "Hale & Wick", code: "HLW-03", category: "Hair" },
  { name: "Sera Botanics", code: "SER-04", category: "Colour and body" },
]

export const productLink = {
  product: products[0],
  customer: customers[0],
  vendor: vendors[0],
  customerSku: "GLW-LIP-014",
  price: 35.56,
  currency: "USD",
}

const quoteLines = [
  { sku: "GLW-LIP-014", name: "Velvet Matte Lipstick", qty: 100, price: 35.56, currency: "USD" },
  { sku: "GLW-SER-208", name: "Hydra Glow Serum", qty: 60, price: 23.5, currency: "USD" },
]

const quoteBase = {
  number: "Q-2026-1001",
  customer: "The Glow Edit",
  terms: "Net 30",
  status: "sent" as const,
  lines: quoteLines,
  total: quoteLines.reduce((sum, line) => sum + line.price * line.qty, 0),
  currency: "USD",
  becomes: "O-2026-2003",
}

const assignmentRecords = [
  {
    order: "O-2026-2001",
    customer: "Bloom & Birch",
    vendor: "Atelier Forme",
    item: "Velvet Matte Lipstick",
    qty: 25,
    due: "2026-08-20",
    status: "assigned" as const,
  },
  {
    order: "O-2026-2001",
    customer: "Bloom & Birch",
    vendor: "Northline Labs",
    item: "Velvet Matte Lipstick",
    qty: 15,
    due: "2026-08-25",
    status: "pending" as const,
  },
  {
    order: "O-2026-2001",
    customer: "Bloom & Birch",
    vendor: "Sera Botanics",
    item: "Soft Focus Foundation",
    qty: 15,
    due: "2026-08-22",
    status: "assigned" as const,
  },
  {
    order: "O-2026-2002",
    customer: "Marlowe Apothecary",
    vendor: "Sera Botanics",
    item: "Neroli Body Oil",
    qty: 100,
    due: "2026-07-30",
    status: "completed" as const,
  },
  {
    order: "O-2026-2002",
    customer: "Marlowe Apothecary",
    vendor: "Sera Botanics",
    item: "Neroli Body Oil",
    qty: 50,
    due: "2026-08-10",
    status: "in_progress" as const,
  },
]

const leadProduct = products[0]
const lowText = lowStock.map((product) => `${product.name} (${product.onHand})`).join(" and ")
const quoteTotal = formatCurrency(quoteBase.total, quoteBase.currency)
const unitPrice = formatCurrency(productLink.price, productLink.currency)
const lineTwoPrice = formatCurrency(quoteBase.lines[1].price, quoteBase.lines[1].currency)

export const connectorTools = [
  "Products",
  "Customers",
  "Vendors",
  "Quotes",
  "Orders",
  "Vendor orders",
]

export type BeatId = "stock" | "people" | "quote" | "floor" | "ask"

/** Today's calendar, shifted onto the records. Called per request so the date is not frozen at startup. */
export function createDemo(now: Date) {
  const { asOfLabel, sampleDay, shiftISO } = calendarFrom(now)
  const quote = {
    ...quoteBase,
    validUntil: formatDay(shiftISO("2026-08-31"), true),
  }
  const assignments = assignmentRecords.map((job) => {
    const due = shiftISO(job.due)
    return { ...job, due: formatISODate(due), dueLabel: formatDay(due, false) }
  })
  const lateAssignments = assignments.filter(
    (job) => job.status !== "completed" && job.due < sampleDay
  )
  const vendorLate = lateAssignments.find((job) => job.vendor === "Atelier Forme")!
  const batchLate = lateAssignments.find((job) => job.item === "Neroli Body Oil" && job.status === "in_progress")!

  const reading = [
  `${lowStock[0].name} · ${lowStock[0].onHand} on hand`,
  `${lowStock[1].name} · ${lowStock[1].onHand} on hand`,
  `${quote.number} · ${quoteTotal} · sent`,
  `${vendorLate.vendor} · ${vendorLate.qty} units · ${vendorLate.item} · due ${vendorLate.dueLabel} · late`,
]

  const beats = [
  {
    id: "stock",
    kicker: "01",
    title: "Stock",
    blurb: "What is on hand",
    nav: "Products",
    question: "What is running low?",
    answer: `${lowStock.length} products are under ${LOW_AT} on hand: ${lowText}. ${leadProduct.name} still has ${leadProduct.onHand}.`,
    caption: "Categories, quantities, and the products that need a reorder.",
  },
  {
    id: "people",
    kicker: "02",
    title: "Customers and vendors",
    blurb: "Who buys, who supplies",
    nav: "Customers",
    question: `Who is the customer for ${leadProduct.name}, and which vendor supplies it?`,
    answer: `${productLink.customer.name} buys it as ${productLink.customerSku} at ${unitPrice}, ${productLink.customer.terms}. ${productLink.vendor.name} supplies it.`,
    caption: "One product, the customer account, and the vendor on the same card.",
  },
  {
    id: "quote",
    kicker: "03",
    title: "The quote",
    blurb: "A price, ready to send",
    nav: "Quotes",
    question: `What is on the open quote for ${quoteBase.customer}?`,
    answer: `${quote.number} is sent. ${quote.lines[0].qty} units of ${quote.lines[0].name} at ${unitPrice} and ${quote.lines[1].qty} units of ${quote.lines[1].name} at ${lineTwoPrice}. The total is ${quoteTotal}, valid through ${quote.validUntil}.`,
    caption: "When the customer accepts it, the same lines become an order.",
  },
  {
    id: "floor",
    kicker: "04",
    title: "Fulfillment",
    blurb: "Which vendor orders are late",
    nav: "Orders",
    question: "Which vendor orders are late?",
    answer: `${lateAssignments.length} vendor orders are past ${asOfLabel}. ${vendorLate.vendor} has not delivered ${vendorLate.qty} units of ${vendorLate.item} on ${vendorLate.order}, due ${vendorLate.dueLabel}. ${batchLate.vendor}'s second delivery, ${batchLate.qty} units of ${batchLate.item} on ${batchLate.order}, was due ${batchLate.dueLabel} and is still open.`,
    caption: "Customer orders are covered by vendor orders, with the late ones marked.",
  },
  {
    id: "ask",
    kicker: "05",
    title: "Ask it",
    blurb: "The same records, in a sentence",
    nav: "Ask",
    question: "Give me a one-line read of the company.",
    answer: `${products.length} products, ${categoryCount} categories, ${customers.length} customers, ${vendors.length} vendors. Quote ${quote.number} is out for ${quoteTotal}. ${lateAssignments.length} vendor orders are late, including ${vendorLate.vendor}'s ${vendorLate.qty} units of ${vendorLate.item} for ${vendorLate.customer}.`,
    caption: "The assistant is reading the records already on screen.",
  },
  ]

  return { asOfLabel, sampleDay, quote, assignments, lateAssignments, reading, beats, vendorLate, batchLate }
}

export type DemoData = ReturnType<typeof createDemo>
