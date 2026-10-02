import { formatCurrency } from "@/lib/utils"

/**
 * Dummy records for the public demo.
 * Nothing here is loaded from the database.
 */

/** The story is frozen on this morning so "late" means one thing. */
export const SAMPLE_DAY = "2026-08-21"
export const SAMPLE_DAY_LABEL = "21 Aug 2026"

export const LOW_AT = 20

export const products = [
  { sku: "SKU-001", name: "Product 1", category: "Category 1", onHand: 42 },
  { sku: "SKU-002", name: "Product 2", category: "Category 1", onHand: 18 },
  { sku: "SKU-003", name: "Product 3", category: "Category 1", onHand: 120 },
  { sku: "SKU-004", name: "Product 4", category: "Category 2", onHand: 64 },
  { sku: "SKU-005", name: "Product 5", category: "Category 2", onHand: 30 },
  { sku: "SKU-006", name: "Product 6", category: "Category 3", onHand: 9 },
  { sku: "SKU-007", name: "Product 7", category: "Category 3", onHand: 22 },
]

export const lowStock = products.filter((product) => product.onHand < LOW_AT)

export const customers = [
  { name: "Customer 1", account: "ACCT-1001", currency: "GBP", terms: "Net 30" },
  { name: "Customer 2", account: "ACCT-1002", currency: "USD", terms: "Net 45" },
  { name: "Customer 3", account: "ACCT-1003", currency: "AED", terms: "Net 30" },
]

export const vendors = [
  { name: "Vendor 1", code: "VEN-01", category: "Category 1" },
  { name: "Vendor 2", code: "VEN-02", category: "Category 1" },
  { name: "Vendor 3", code: "VEN-03", category: "Category 2" },
  { name: "Vendor 4", code: "VEN-04", category: "Category 3" },
]

export const productLink = {
  product: products[0],
  customer: customers[0],
  vendor: vendors[0],
  customerSku: "C1-SKU-001",
  price: 28,
  currency: "GBP",
}

const quoteLines = [
  { sku: "C1-SKU-001", name: "Product 1", qty: 100, price: 28, currency: "GBP" },
  { sku: "C1-SKU-002", name: "Product 2", qty: 60, price: 18.5, currency: "GBP" },
]

export const quote = {
  number: "Q-2026-1001",
  customer: "Customer 1",
  terms: "Net 30",
  status: "sent" as const,
  validUntil: "31 Aug 2026",
  lines: quoteLines,
  total: quoteLines.reduce((sum, line) => sum + line.price * line.qty, 0),
  currency: "GBP",
  becomes: "O-2026-2003",
}

export const assignments = [
  {
    order: "O-2026-2001",
    customer: "Customer 3",
    vendor: "Vendor 1",
    item: "Product 1",
    qty: 25,
    due: "2026-08-20",
    dueLabel: "20 Aug",
    status: "assigned" as const,
  },
  {
    order: "O-2026-2001",
    customer: "Customer 3",
    vendor: "Vendor 2",
    item: "Product 1",
    qty: 15,
    due: "2026-08-25",
    dueLabel: "25 Aug",
    status: "pending" as const,
  },
  {
    order: "O-2026-2001",
    customer: "Customer 3",
    vendor: "Vendor 4",
    item: "Product 7",
    qty: 15,
    due: "2026-08-22",
    dueLabel: "22 Aug",
    status: "assigned" as const,
  },
  {
    order: "O-2026-2002",
    customer: "Customer 2",
    vendor: "Vendor 4",
    item: "Product 6",
    qty: 100,
    due: "2026-07-30",
    dueLabel: "30 Jul",
    status: "completed" as const,
  },
  {
    order: "O-2026-2002",
    customer: "Customer 2",
    vendor: "Vendor 4",
    item: "Product 6",
    qty: 50,
    due: "2026-08-10",
    dueLabel: "10 Aug",
    status: "in_progress" as const,
  },
]

export const lateAssignments = assignments.filter(
  (job) => job.status !== "completed" && job.due < SAMPLE_DAY
)

const leadProduct = products[0]
const vendorLate = lateAssignments.find((job) => job.vendor === "Vendor 1")!
const batchLate = lateAssignments.find((job) => job.item === "Product 6" && job.status === "in_progress")!
const lowText = lowStock.map((product) => `${product.name} (${product.onHand})`).join(" and ")
const quoteTotal = formatCurrency(quote.total, quote.currency)
const unitPrice = formatCurrency(productLink.price, productLink.currency)
const lineTwoPrice = formatCurrency(quote.lines[1].price, quote.lines[1].currency)

export const connectorTools = [
  "Products",
  "Customers",
  "Vendors",
  "Quotes",
  "Orders",
  "Assignments",
]

export const reading = [
  `${lowStock[0].name} · ${lowStock[0].onHand} on hand`,
  `${lowStock[1].name} · ${lowStock[1].onHand} on hand`,
  `${quote.number} · ${quoteTotal} · sent`,
  `${vendorLate.vendor} · ${vendorLate.qty} units · ${vendorLate.item} · due ${vendorLate.dueLabel} · late`,
]

export const beats = [
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
    question: `What is on the open quote for ${quote.customer}?`,
    answer: `${quote.number} is sent. ${quote.lines[0].qty} units of ${quote.lines[0].name} at ${unitPrice} and ${quote.lines[1].qty} units of ${quote.lines[1].name} at ${lineTwoPrice}. The total is ${quoteTotal}, valid through ${quote.validUntil}.`,
    caption: "When the customer accepts it, the same lines become an order.",
  },
  {
    id: "floor",
    kicker: "04",
    title: "Fulfillment",
    blurb: "Which assignments are late",
    nav: "Orders",
    question: "Which assignments are late?",
    answer: `${lateAssignments.length} assignments are past ${SAMPLE_DAY_LABEL}. ${vendorLate.vendor} still holds ${vendorLate.qty} units of ${vendorLate.item} on ${vendorLate.order}, due ${vendorLate.dueLabel}. ${batchLate.vendor}'s second batch, ${batchLate.qty} units of ${batchLate.item} on ${batchLate.order}, was due ${batchLate.dueLabel} and is still in progress.`,
    caption: "Orders split into vendor assignments, with the late ones marked.",
  },
  {
    id: "ask",
    kicker: "05",
    title: "Ask it",
    blurb: "The same records, in a sentence",
    nav: "Ask",
    question: "Give me a one-line read of the company.",
    answer: `${products.length} products, 3 categories, ${customers.length} customers, ${vendors.length} vendors. Quote ${quote.number} is out for ${quoteTotal}. ${lateAssignments.length} assignments are late, including ${vendorLate.vendor}'s ${vendorLate.qty} units of ${vendorLate.item} for ${vendorLate.customer}.`,
    caption: "The assistant is reading the records already on screen.",
  },
] as const

export type BeatId = (typeof beats)[number]["id"]
