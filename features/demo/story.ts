import { formatCurrency } from "@/lib/utils"
import { lowStock, productLink, products, type DemoData } from "@/features/demo/studio"

export type StoryCue = {
  id: string
  step: number
  spot: string
  title: string
  body: string
}

/** The walkthrough stays on the tool. Each cue points at something already on screen. */
export function createStoryCues(demo: DemoData): StoryCue[] {
  const { quote, asOfLabel, vendorLate, batchLate, lateAssignments } = demo
  const money = formatCurrency(quote.total, quote.currency)
  const unit = formatCurrency(productLink.price, productLink.currency)

  return [
    {
      id: "open-dashboard",
      step: 0,
      spot: "nav-dashboard",
      title: "Dashboard",
      body: "Products, customers, quotes, and orders, counted in one place.",
    },
    {
      id: "overdue",
      step: 0,
      spot: "overdue",
      title: "Late supply",
      body: `As of ${asOfLabel}, ${lateAssignments.length} vendor orders are past due. ${vendorLate.vendor} has not delivered ${vendorLate.qty} units of ${vendorLate.item}.`,
    },
    {
      id: "quote-row",
      step: 0,
      spot: "quote-row",
      title: quote.number,
      body: `Sent to ${quote.customer} for ${money}. Accepted, these lines become ${quote.becomes}.`,
    },
    {
      id: "open-products",
      step: 1,
      spot: "nav-products",
      title: "Products",
      body: "The catalogue. Each product sits in a collection.",
    },
    {
      id: "low-p2",
      step: 1,
      spot: "low-p2",
      title: lowStock[0].name,
      body: `${lowStock[0].onHand} on hand. Under 20 needs a reorder.`,
    },
    {
      id: "low-p6",
      step: 1,
      spot: "low-p6",
      title: lowStock[1].name,
      body: `${lowStock[1].onHand} on hand. ${products[0].name} is still fine at ${products[0].onHand}.`,
    },
    {
      id: "open-customers",
      step: 3,
      spot: "nav-customers",
      title: "Customers",
      body: "The accounts that buy, with currency and payment terms.",
    },
    {
      id: "product-link",
      step: 3,
      spot: "product-link",
      title: productLink.customer.name,
      body: `Buys ${productLink.product.name} as ${productLink.customerSku} at ${unit}. ${productLink.vendor.name} supplies it.`,
    },
    {
      id: "open-vendors",
      step: 4,
      spot: "nav-vendors",
      title: "Vendors",
      body: "The companies that supply what you sell to customers.",
    },
    {
      id: "late-v4",
      step: 4,
      spot: "late-v4",
      title: "A second delivery",
      body: `${batchLate.vendor} still owes ${batchLate.qty} units of ${batchLate.item} on ${batchLate.order}, due ${batchLate.dueLabel}.`,
    },
    {
      id: "open-quotes",
      step: 5,
      spot: "nav-quotes",
      title: "Quotes",
      body: "A customer's lines, priced, before they become an order.",
    },
    {
      id: "quote-total",
      step: 5,
      spot: "quote-total",
      title: "The total",
      body: `${money}, valid through ${quote.validUntil}.`,
    },
    {
      id: "open-orders",
      step: 6,
      spot: "nav-orders",
      title: "Orders",
      body: "Each customer order is covered by vendor orders: who supplies it, how many, and the due date.",
    },
    {
      id: "late-v1",
      step: 6,
      spot: "late-v1",
      title: "Late by a day",
      body: `${vendorLate.order} for ${vendorLate.customer}. ${vendorLate.vendor} has not delivered ${vendorLate.qty} units of ${vendorLate.item}, due ${vendorLate.dueLabel}.`,
    },
  ]
}

export const STORY_HOLD_MS = 2800
