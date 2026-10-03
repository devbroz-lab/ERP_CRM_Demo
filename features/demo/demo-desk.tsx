"use client"

import Link from "next/link"
import { forwardRef, useLayoutEffect, useMemo, useRef, useState } from "react"
import {
  Check,
  ChevronLeft,
  ChevronRight,
  Copy,
  FileText,
  Key,
  Layers,
  LayoutDashboard,
  LogOut,
  Moon,
  Package,
  Truck,
  Plus,
  Settings,
  ShoppingCart,
  Sun,
  Users,
  X,
} from "lucide-react"
import { useTheme } from "next-themes"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { PageHeader } from "@/components/shared/page-header"
import { SearchInput } from "@/components/shared/search-input"
import { StatusBadge } from "@/components/shared/status-badge"
import { StatusFilter } from "@/components/shared/status-filter"
import { cn, formatCurrency, formatDate } from "@/lib/utils"
import {
  LOW_AT,
  categoryCount,
  customers,
  productLink,
  products,
  vendors,
  type DemoData,
} from "@/features/demo/studio"
import { createStoryCues } from "@/features/demo/story"

const CREATED = "2026-07-12T12:00:00.000Z"

const sections = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "products", label: "Products", icon: Package },
  { id: "collections", label: "Collections", icon: Layers },
  { id: "customers", label: "Customers", icon: Users },
  { id: "vendors", label: "Vendors", icon: Truck },
  { id: "quotes", label: "Quotes", icon: FileText },
  { id: "orders", label: "Orders", icon: ShoppingCart },
  { id: "settings", label: "Settings", icon: Settings },
] as const

const collections = [
  { name: "Makeup", description: "Colour, lips, and complexion" },
  { name: "Skincare", description: "Serum, SPF, and masks" },
  { name: "Hair", description: "Wash and repair" },
  { name: "Body", description: "Oils and daily care" },
]

export function DemoDesk({ demo }: { demo: DemoData }) {
  const { assignments, quote, sampleDay } = demo
  const storyCues = useMemo(() => createStoryCues(demo), [demo])
  const [section, setSection] = useState(0)
  const [playhead, setPlayhead] = useState<number | null>(null)
  const [collapsed, setCollapsed] = useState(false)

  const cue = playhead !== null ? storyCues[playhead] : null
  const view = cue ? cue.step : section
  const current = sections[view]
  const atStart = playhead === null || playhead === 0
  const atEnd = playhead !== null && playhead >= storyCues.length - 1

  const activeAssignments = assignments.filter((job) => job.status !== "completed")
  const overdueAssignments = activeAssignments.filter((job) => job.due < sampleDay)

  function leaveStory(next: number) {
    setPlayhead(null)
    setSection(next)
  }

  function stepBy(delta: number) {
    setPlayhead((currentIndex) => {
      if (currentIndex === null) return delta > 0 ? 0 : null
      const next = currentIndex + delta
      if (next < 0) return currentIndex
      if (next >= storyCues.length) return null
      return next
    })
  }

  return (
    <div className="flex h-dvh overflow-hidden bg-background text-foreground">
      <aside
        className={cn(
          "flex h-full shrink-0 flex-col border-r border-border/50 bg-background/80 backdrop-blur-xl transition-all duration-300",
          collapsed ? "w-16" : "w-56"
        )}
      >
        <div
          className={cn(
            "flex h-16 shrink-0 items-center border-b border-border/50",
            collapsed ? "justify-center px-2" : "px-4"
          )}
        >
          {!collapsed && <p className="text-sm font-semibold tracking-tight">Accountbook</p>}
        </div>
        <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4">
          {sections.map((item, index) => {
            const Icon = item.icon
            const active = index === view
            return (
              <button
                key={item.id}
                type="button"
                data-spot={`nav-${item.id}`}
                onClick={() => leaveStory(index)}
                className={cn(
                  "flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200",
                  collapsed && "justify-center",
                  active
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "text-muted-foreground hover:bg-accent/50 hover:text-foreground"
                )}
              >
                <Icon className="h-[18px] w-[18px] shrink-0" />
                {!collapsed && <span>{item.label}</span>}
              </button>
            )
          })}
        </nav>
        <div className="space-y-1 border-t border-border/50 p-3">
          <button
            type="button"
            onClick={() => setPlayhead(0)}
            className={cn(
              "mb-1 flex w-full items-center gap-2 rounded-lg bg-primary px-3 py-2.5 text-sm font-medium text-primary-foreground shadow-sm hover:bg-primary/90",
              collapsed && "justify-center",
              playhead !== null && "ring-2 ring-primary/40"
            )}
          >
            <FileText className="h-4 w-4" />
            {!collapsed && <span>Product tour</span>}
          </button>
          <Link
            href="/"
            className={cn(
              "flex w-full items-center gap-2 rounded-lg px-3 py-2 text-xs text-muted-foreground hover:bg-accent/50 hover:text-foreground",
              collapsed && "justify-center"
            )}
          >
            <LogOut className="h-4 w-4" />
            {!collapsed && <span>Exit demo</span>}
          </Link>
          <button
            type="button"
            onClick={() => setCollapsed((value) => !value)}
            className={cn(
              "flex w-full items-center gap-2 rounded-lg px-3 py-2 text-xs text-muted-foreground hover:bg-accent/50 hover:text-foreground",
              collapsed && "justify-center"
            )}
          >
            {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
            {!collapsed && <span>Collapse</span>}
          </button>
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
        <DemoTopbar />
        <main className="relative flex-1 overflow-y-auto bg-muted/30">
          {current.id === "dashboard" && (
            <DashboardView
              quote={quote}
              assignments={assignments}
              sampleDay={sampleDay}
              activeCount={activeAssignments.length}
              onOpen={leaveStory}
            />
          )}
          {current.id === "products" && <ProductsView />}
          {current.id === "collections" && <CollectionsView />}
          {current.id === "customers" && <CustomersView />}
          {current.id === "vendors" && <VendorsView assignments={assignments} sampleDay={sampleDay} />}
          {current.id === "quotes" && <QuotesView quote={quote} />}
          {current.id === "orders" && (
            <OrdersView quote={quote} assignments={assignments} sampleDay={sampleDay} />
          )}
          {current.id === "settings" && <SettingsView />}
          {cue && playhead !== null && (
            <TourSpotlight
              spot={cue.spot}
              title={cue.title}
              body={cue.body}
              index={playhead}
              total={storyCues.length}
              atStart={atStart}
              atEnd={atEnd}
              onClose={() => setPlayhead(null)}
              onBack={() => stepBy(-1)}
              onNext={() => stepBy(1)}
            />
          )}
        </main>
      </div>
    </div>
  )
}

function DemoTopbar() {
  const { theme, setTheme } = useTheme()

  return (
    <header className="flex h-16 shrink-0 items-center justify-end border-b border-border/50 bg-background/80 px-6 backdrop-blur-lg">
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="icon"
          className="h-9 w-9 rounded-full"
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
        >
          <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          <span className="sr-only">Toggle theme</span>
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="h-9 gap-2 rounded-full px-2 hover:bg-accent/50">
              <Avatar className="h-6 w-6">
                <AvatarFallback className="bg-primary/10 text-xs font-medium text-primary">P</AvatarFallback>
              </Avatar>
              <span className="hidden text-sm font-medium sm:block">Preview</span>
              <span className="hidden rounded-full bg-violet-100 px-1.5 py-0.5 text-[10px] font-medium text-violet-700 capitalize sm:inline-flex dark:bg-violet-900/30 dark:text-violet-300">
                admin
              </span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuLabel className="font-normal">
              <div className="text-sm font-medium">Preview</div>
              <div className="text-xs text-muted-foreground">Admin</div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href="/" className="cursor-pointer">
                <LogOut className="mr-2 h-4 w-4" />
                Exit demo
              </Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}

function DashboardView({
  quote,
  assignments,
  sampleDay,
  activeCount,
  onOpen,
}: {
  quote: DemoData["quote"]
  assignments: DemoData["assignments"]
  sampleDay: string
  activeCount: number
  onOpen: (index: number) => void
}) {
  const lateJobs = assignments.filter((job) => job.status !== "completed" && job.due < sampleDay)
  const orders = orderRows(quote)
  const stats = [
    { label: "Active Products", value: products.length, icon: Package, index: 1, spot: "stat-products" },
    { label: "Collections", value: categoryCount, icon: Layers, index: 2 },
    { label: "Active Customers", value: customers.length, icon: Users, index: 3 },
    { label: "Active Vendors", value: vendors.length, icon: Truck, index: 4 },
    { label: "Open Quotes", value: 1, icon: FileText, index: 5 },
    { label: "Active Orders", value: orders.length, icon: ShoppingCart, index: 6 },
  ]

  return (
    <div className="space-y-8">
      <div className="px-8 pt-8 pb-2">
        <h1 className="text-xl font-semibold tracking-tight">Dashboard</h1>
      </div>
      <div className="px-8">
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
          {stats.map((card) => {
            const Icon = card.icon
            return (
              <button
                key={card.label}
                type="button"
                data-spot={card.spot}
                onClick={() => onOpen(card.index)}
                className="group rounded-xl border border-border/60 bg-card/50 p-5 text-left backdrop-blur-sm hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5"
              >
                <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 group-hover:bg-primary/20">
                  <Icon className="h-[18px] w-[18px] text-primary" />
                </div>
                <p className="text-2xl font-semibold">{card.value}</p>
                <p className="mt-0.5 text-xs text-muted-foreground">{card.label}</p>
              </button>
            )
          })}
        </div>
      </div>

      <div className="px-8">
        <h2 className="mb-3 text-sm font-medium">Purchasing</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <button
            type="button"
            onClick={() => onOpen(4)}
            className="group flex items-center gap-4 rounded-xl border border-border/60 bg-card/50 p-5 text-left backdrop-blur-sm hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5"
          >
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 group-hover:bg-primary/20">
              <Truck className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-semibold">{activeCount}</p>
              <p className="text-xs text-muted-foreground">Vendor orders open</p>
            </div>
          </button>
          {lateJobs.length > 0 && (
            <button
              type="button"
              data-spot="overdue"
              onClick={() => onOpen(4)}
              className="group rounded-xl border border-amber-200 bg-amber-50/50 p-5 text-left backdrop-blur-sm hover:border-amber-300 hover:shadow-lg dark:border-amber-900/50 dark:bg-amber-950/20 dark:hover:border-amber-800"
            >
              <div className="flex items-center gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-amber-100 dark:bg-amber-900/30">
                  <Truck className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                </div>
                <div>
                  <p className="text-2xl font-semibold text-amber-700 dark:text-amber-400">{lateJobs.length}</p>
                  <p className="text-xs text-amber-600 dark:text-amber-500">Late vendor orders</p>
                </div>
              </div>
              <ul className="mt-4 space-y-2 border-t border-amber-200/80 pt-3 dark:border-amber-900/50">
                {lateJobs.map((job) => (
                  <li key={`${job.vendor}-${job.due}-${job.qty}`}>
                    <p className="text-sm font-medium text-amber-800 dark:text-amber-300">{job.vendor}</p>
                    <p className="text-xs text-amber-700/80 dark:text-amber-400/80">
                      {job.qty} {job.item} · {job.order} · due {job.dueLabel}
                    </p>
                  </li>
                ))}
              </ul>
            </button>
          )}
        </div>
      </div>

      <div className="grid gap-6 px-8 pb-8 sm:grid-cols-2">
        <div>
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-sm font-medium">Recent Quotes</h2>
            <button type="button" onClick={() => onOpen(5)} className="text-xs text-muted-foreground hover:text-primary">
              View all →
            </button>
          </div>
          <button
            type="button"
            data-spot="quote-row"
            onClick={() => onOpen(5)}
            className="flex w-full items-center justify-between rounded-lg p-3 text-left hover:bg-accent/40"
          >
            <div className="min-w-0">
              <p className="font-mono text-sm font-medium">{quote.number}</p>
              <p className="truncate text-xs text-muted-foreground">{quote.customer}</p>
              <p className="truncate text-xs text-muted-foreground">Becomes {quote.becomes}</p>
            </div>
            <div className="flex shrink-0 items-center gap-2">
              <span className="text-xs text-muted-foreground">{formatCurrency(quote.total, quote.currency)}</span>
              <StatusBadge status={quote.status} />
            </div>
          </button>
        </div>
        <div>
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-sm font-medium">Recent Orders</h2>
            <button type="button" onClick={() => onOpen(6)} className="text-xs text-muted-foreground hover:text-primary">
              View all →
            </button>
          </div>
          <div className="space-y-1">
            {orders.map((order) => (
              <button
                key={order.number}
                type="button"
                onClick={() => onOpen(6)}
                className="flex w-full items-center justify-between gap-3 rounded-lg p-3 text-left hover:bg-accent/40"
              >
                <div className="min-w-0">
                  <p className="whitespace-nowrap font-mono text-sm font-medium">{order.number}</p>
                  <p className="truncate text-xs text-muted-foreground">{order.customer}</p>
                </div>
                <div className="flex shrink-0 items-center gap-2">
                  {order.total != null && (
                    <span className="whitespace-nowrap text-xs text-muted-foreground">{formatCurrency(order.total, order.currency)}</span>
                  )}
                  <StatusBadge status={order.status} />
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

function ProductsView() {
  const [search, setSearch] = useState("")
  const [status, setStatus] = useState("active")
  const rows = products.filter((product) => {
    const haystack = `${product.name} ${product.sku}`.toLowerCase()
    return status !== "archived" && haystack.includes(search.toLowerCase())
  })

  return (
    <Screen
      title="Products"
      description="Your complete product master — one product, one record."
      action="New Product"
      search={search}
      onSearch={setSearch}
      searchPlaceholder="Search by name or SKU..."
      status={status}
      onStatus={setStatus}
      statusOptions={[
        { label: "Active", value: "active" },
        { label: "Archived", value: "archived" },
        { label: "All", value: "all" },
      ]}
    >
      <RecordTable
        headers={["Product", "Collection", "On hand", "Status", "Created"]}
        rows={rows.map((product) => {
          const low = product.onHand < LOW_AT
          return {
            key: product.sku,
            spot: product.sku === "SER-208" ? "low-p2" : product.sku === "OIL-019" ? "low-p6" : undefined,
            cells: [
              <div key="name">
                <p className="text-sm font-medium">{product.name}</p>
                <p className="font-mono text-xs text-muted-foreground">{product.sku}</p>
              </div>,
              <span key="collection" className="text-sm text-muted-foreground">{product.category}</span>,
              <span key="hand" className={cn("text-sm tabular-nums", low && "font-medium text-amber-700")}>
                {product.onHand}
                {low ? " · reorder" : ""}
              </span>,
              <StatusBadge key="status" status="active" />,
              <span key="date" className="text-xs text-muted-foreground">{formatDate(CREATED)}</span>,
            ],
          }
        })}
      />
    </Screen>
  )
}

function CollectionsView() {
  const [search, setSearch] = useState("")
  const rows = collections.filter((collection) => collection.name.toLowerCase().includes(search.toLowerCase()))

  return (
    <Screen
      title="Collections"
      description="Group products into the ranges you sell."
      action="New Collection"
      search={search}
      onSearch={setSearch}
      searchPlaceholder="Search collections..."
    >
      <RecordTable
        headers={["Collection", "Description", "Status", "Created"]}
        rows={rows.map((collection) => ({
          key: collection.name,
          cells: [
            <p key="name" className="text-sm font-medium">{collection.name}</p>,
            <span key="desc" className="text-sm text-muted-foreground">{collection.description}</span>,
            <StatusBadge key="status" status="active" />,
            <span key="date" className="text-xs text-muted-foreground">{formatDate(CREATED)}</span>,
          ],
        }))}
      />
    </Screen>
  )
}

function CustomersView() {
  const [search, setSearch] = useState("")
  const rows = customers.filter((customer) => customer.name.toLowerCase().includes(search.toLowerCase()))

  return (
    <Screen
      title="Customers"
      description="Wholesale accounts, currencies, and payment terms."
      action="New Customer"
      search={search}
      onSearch={setSearch}
      searchPlaceholder="Search customers..."
    >
      <RecordTable
        headers={["Customer", "Currency", "Status", "Added"]}
        rows={rows.map((customer) => ({
          key: customer.account,
          spot: customer.name === productLink.customer.name ? "product-link" : undefined,
          cells: [
            <div key="name">
              <p className="text-sm font-medium">{customer.name}</p>
              <p className="text-xs text-muted-foreground">{customer.terms}</p>
              {customer.name === productLink.customer.name && (
                <p className="mt-1 text-xs text-muted-foreground">
                  {productLink.product.name} · {productLink.customerSku} · {formatCurrency(productLink.price, productLink.currency)} · {productLink.vendor.name}
                </p>
              )}
            </div>,
            <span key="currency" className="font-mono text-sm text-muted-foreground">{customer.currency}</span>,
            <StatusBadge key="status" status="active" />,
            <span key="date" className="text-xs text-muted-foreground">{formatDate(CREATED)}</span>,
          ],
        }))}
      />
    </Screen>
  )
}

function VendorsView({
  assignments,
  sampleDay,
}: {
  assignments: DemoData["assignments"]
  sampleDay: string
}) {
  const [search, setSearch] = useState("")
  const rows = vendors.filter((vendor) => vendor.name.toLowerCase().includes(search.toLowerCase()))

  return (
    <Screen
      title="Vendors"
      description="Suppliers for the products you sell."
      action="New Vendor"
      search={search}
      onSearch={setSearch}
      searchPlaceholder="Search vendors..."
    >
      <RecordTable
        headers={["Vendor", "Supplies", "Open deliveries", "Status"]}
        rows={rows.map((vendor) => {
          const jobs = assignments.filter((job) => job.vendor === vendor.name && job.status !== "completed")
          return {
            key: vendor.code,
            spot: vendor.name === "Sera Botanics" ? "late-v4" : undefined,
            cells: [
              <div key="name">
                <p className="text-sm font-medium">{vendor.name}</p>
                <p className="font-mono text-xs text-muted-foreground">{vendor.code}</p>
              </div>,
              <p key="spec" className="text-sm text-muted-foreground">{vendor.category}</p>,
              <div key="jobs" className="space-y-1">
                {jobs.length === 0 ? (
                  <span className="text-sm text-muted-foreground">—</span>
                ) : (
                  jobs.map((job) => {
                    const late = job.due < sampleDay
                    return (
                      <p key={`${job.order}-${job.due}-${job.qty}`} className={cn("text-xs", late && "font-medium text-amber-700")}>
                        {job.qty} {job.item} · {job.order} · due {job.dueLabel}
                        {late ? " · late" : ""}
                      </p>
                    )
                  })
                )}
              </div>,
              <StatusBadge key="status" status="active" />,
            ],
          }
        })}
      />
    </Screen>
  )
}

function QuotesView({ quote }: { quote: DemoData["quote"] }) {
  const [search, setSearch] = useState("")
  const visible = `${quote.number} ${quote.customer}`.toLowerCase().includes(search.toLowerCase())

  return (
    <Screen
      title="Quotes"
      description="Build and track customer quotations."
      action="New Quote"
      search={search}
      onSearch={setSearch}
      searchPlaceholder="Search quotes or customers..."
    >
      <RecordTable
        headers={["Quote", "Customer", "Total", "Status", "Created"]}
        rows={
          visible
            ? [
                {
                  key: quote.number,
                  cells: [
                    <div key="num">
                      <p className="font-mono text-sm font-medium">{quote.number}</p>
                      <p className="text-xs text-muted-foreground">Valid through {quote.validUntil}</p>
                      <p className="text-xs text-muted-foreground">Becomes {quote.becomes}</p>
                    </div>,
                    <div key="customer">
                      <p className="text-sm">{quote.customer}</p>
                      {quote.lines.map((line) => (
                        <p key={line.sku} className="text-xs text-muted-foreground">
                          {line.qty} {line.name} · {formatCurrency(line.price, line.currency)}
                        </p>
                      ))}
                    </div>,
                    <span key="total" data-spot="quote-total" className="text-sm font-medium">
                      {formatCurrency(quote.total, quote.currency)}
                    </span>,
                    <StatusBadge key="status" status={quote.status} />,
                    <span key="date" className="text-xs text-muted-foreground">{formatDate(CREATED)}</span>,
                  ],
                },
              ]
            : []
        }
      />
    </Screen>
  )
}

function OrdersView({
  quote,
  assignments,
  sampleDay,
}: {
  quote: DemoData["quote"]
  assignments: DemoData["assignments"]
  sampleDay: string
}) {
  const [search, setSearch] = useState("")
  const rows = orderRows(quote).filter((order) =>
    `${order.number} ${order.customer}`.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <Screen
      title="Orders"
      description="Track customer orders from confirmation to delivery."
      action="New Order"
      search={search}
      onSearch={setSearch}
      searchPlaceholder="Search orders or customers..."
    >
      <RecordTable
        headers={["Order", "Customer", "Vendor deliveries", "From Quote", "Total", "Status"]}
        rows={rows.map((order) => {
          const jobs = assignments.filter((job) => job.order === order.number)
          return {
          key: order.number,
          spot: order.number === "O-2026-2001" ? "late-v1" : undefined,
          cells: [
            <span key="num" className="font-mono text-sm font-medium">{order.number}</span>,
            <span key="customer" className="text-sm">{order.customer}</span>,
            <div key="jobs" className="space-y-1">
              {jobs.length === 0 ? (
                <span className="text-xs text-muted-foreground">No vendor order yet</span>
              ) : (
                jobs.map((job) => {
                  const late = job.status !== "completed" && job.due < sampleDay
                  return (
                    <p key={`${job.vendor}-${job.due}-${job.qty}`} className={cn("text-xs", late && "font-medium text-amber-700")}>
                      {job.vendor} · {job.qty} {job.item} · due {job.dueLabel}
                      {late ? " · late" : job.status === "completed" ? " · delivered" : ""}
                    </p>
                  )
                })
              )}
            </div>,
            <span key="quote" className="font-mono text-xs text-muted-foreground">{order.quote ?? "—"}</span>,
            order.total != null ? (
              <span key="total" className="text-sm font-medium">{formatCurrency(order.total, order.currency)}</span>
            ) : (
              <span key="total" className="text-sm text-muted-foreground">—</span>
            ),
            <StatusBadge key="status" status={order.status} />,
          ],
          }
        })}
      />
    </Screen>
  )
}

const DEMO_MCP_KEY = "msk_demo_8c21f0a4e7b649d2"

function SettingsView() {
  const [open, setOpen] = useState(false)
  const [name, setName] = useState("")
  const [revealed, setRevealed] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)
  const [keys, setKeys] = useState<{ id: string; name: string }[]>([
    { id: "claude", name: "Claude" },
  ])

  function copyKey(value: string) {
    navigator.clipboard.writeText(value)
    setCopied(true)
    window.setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div>
      <Screen title="Settings" description="People who can sign in, and a key for Claude.">
        <RecordTable
          headers={["Name", "Role", "Added"]}
          rows={[
            {
              key: "preview",
              cells: [
                <p key="name" className="text-sm font-medium">Preview</p>,
                <span key="role" className="text-sm text-muted-foreground">Admin</span>,
                <span key="date" className="text-xs text-muted-foreground">{formatDate(CREATED)}</span>,
              ],
            },
          ]}
        />
      </Screen>

      <div className="max-w-2xl space-y-4 px-8 pb-10">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="mb-1 text-sm font-medium">MCP API keys</h2>
            <p className="text-sm text-muted-foreground">
              A key lets Claude read these records through MCP. This one is a sample and is not live.
            </p>
          </div>
          <Button
            size="sm"
            type="button"
            onClick={() => {
              setRevealed(null)
              setName("")
              setOpen(true)
            }}
          >
            <Plus className="mr-1.5 h-4 w-4" /> New key
          </Button>
        </div>

        <div className="space-y-2">
          {keys.map((key) => (
            <div key={key.id} className="flex items-center gap-4 rounded-lg border border-border p-4">
              <Key className="h-4 w-4 shrink-0 text-muted-foreground" />
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium">{key.name}</p>
                <p className="font-mono text-xs text-muted-foreground">{DEMO_MCP_KEY}</p>
              </div>
              <span className="text-xs text-muted-foreground">Read</span>
            </div>
          ))}
        </div>

        <div className="space-y-2 rounded-lg border border-border bg-muted/30 p-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">How to connect Claude</p>
          <ol className="list-inside list-decimal space-y-1 text-xs text-muted-foreground">
            <li>Open Claude, then Settings, Integrations, Add MCP server.</li>
            <li>
              Server URL: <code className="rounded bg-muted px-1 font-mono">https://mcp.example.com/mcp</code>
            </li>
            <li>
              Auth header: <code className="rounded bg-muted px-1 font-mono">Bearer {DEMO_MCP_KEY}</code>
            </li>
          </ol>
        </div>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{revealed ? "Your API key" : "Create API key"}</DialogTitle>
            <DialogDescription>
              {revealed
                ? "This sample key does not connect to a live server."
                : "Name the key. The value is a fixed sample."}
            </DialogDescription>
          </DialogHeader>
          {revealed ? (
            <div className="flex items-center gap-2 rounded-lg border border-border bg-muted/40 p-3">
              <code className="flex-1 break-all font-mono text-xs">{revealed}</code>
              <Button size="sm" variant="outline" className="h-8 shrink-0" type="button" onClick={() => copyKey(revealed)}>
                {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
              </Button>
            </div>
          ) : (
            <div className="space-y-4 pt-2">
              <div className="space-y-1.5">
                <Label className="text-xs uppercase tracking-wide text-muted-foreground">Key name</Label>
                <Input
                  placeholder="Claude"
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                />
              </div>
              <div className="flex gap-3 pt-2">
                <Button variant="outline" className="flex-1" type="button" onClick={() => setOpen(false)}>
                  Cancel
                </Button>
                <Button
                  className="flex-1"
                  type="button"
                  disabled={!name.trim()}
                  onClick={() => {
                    setKeys((current) =>
                      current.some((key) => key.name === name.trim())
                        ? current
                        : [...current, { id: name.trim(), name: name.trim() }]
                    )
                    setRevealed(DEMO_MCP_KEY)
                  }}
                >
                  Generate key
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}

function orderRows(quote: DemoData["quote"]) {
  return [
    { number: "O-2026-2001", customer: "Bloom & Birch", status: "confirmed", quote: null, total: null, currency: "USD" },
    { number: "O-2026-2002", customer: "Marlowe Apothecary", status: "in_production", quote: null, total: null, currency: "USD" },
    { number: "O-2026-2003", customer: "The Glow Edit", status: "pending", quote: quote.number, total: quote.total, currency: quote.currency },
  ]
}

function Screen({
  title,
  description,
  action,
  search,
  onSearch,
  searchPlaceholder,
  status,
  onStatus,
  statusOptions,
  children,
}: {
  title: string
  description: string
  action?: string
  search?: string
  onSearch?: (value: string) => void
  searchPlaceholder?: string
  status?: string
  onStatus?: (value: string) => void
  statusOptions?: { label: string; value: string }[]
  children: React.ReactNode
}) {
  return (
    <>
      <PageHeader title={title} description={description}>
        {action && (
          <Button size="sm" type="button">
            <Plus className="mr-1.5 h-4 w-4" /> {action}
          </Button>
        )}
      </PageHeader>
      {onSearch && (
        <div className="flex items-center gap-3 border-b border-border px-6 py-4">
          <SearchInput value={search ?? ""} onChange={onSearch} placeholder={searchPlaceholder} className="w-72" />
          {status && onStatus && statusOptions && (
            <StatusFilter value={status} onChange={onStatus} options={statusOptions} />
          )}
        </div>
      )}
      {children}
    </>
  )
}

function RecordTable({
  headers,
  rows,
}: {
  headers: string[]
  rows: { key: string; spot?: string; cells: React.ReactNode[] }[]
}) {
  if (rows.length === 0) {
    return <p className="px-8 py-8 text-sm text-muted-foreground">Nothing matches.</p>
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border">
            {headers.map((header) => (
              <th key={header} className="h-9 px-4 text-left text-xs font-medium text-muted-foreground">
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.key} data-spot={row.spot} className="border-b border-border/50 last:border-0 hover:bg-accent/40">
              {row.cells.map((cell, index) => (
                <td key={index} className="px-4 py-3 align-middle">
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

function TourSpotlight({
  spot,
  ...card
}: {
  spot: string
  title: string
  body: string
  index: number
  total: number
  atStart: boolean
  atEnd: boolean
  onClose: () => void
  onBack: () => void
  onNext: () => void
}) {
  const cardRef = useRef<HTMLDivElement>(null)
  const [box, setBox] = useState<{ top: number; left: number; width: number; height: number } | null>(null)
  const [place, setPlace] = useState<{ top: number; left: number } | null>(null)

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
    if (!box || !cardRef.current) return
    const cardWidth = cardRef.current.offsetWidth
    const cardHeight = cardRef.current.offsetHeight
    const gap = 14
    const margin = 16
    const pad = 8
    const hole = {
      top: box.top - pad,
      left: box.left - pad,
      right: box.left + box.width + pad,
      bottom: box.top + box.height + pad,
    }
    const preferRight = hole.left < window.innerWidth * 0.45
    const sides = preferRight
      ? (["right", "bottom", "left", "top"] as const)
      : (["left", "bottom", "right", "top"] as const)

    let placed: { top: number; left: number } | null = null
    for (const side of sides) {
      let top = hole.top + (hole.bottom - hole.top) / 2 - cardHeight / 2
      let left = hole.left
      if (side === "right") left = hole.right + gap
      if (side === "left") left = hole.left - cardWidth - gap
      if (side === "bottom") {
        top = hole.bottom + gap
        left = Math.min(Math.max(margin, hole.left), window.innerWidth - cardWidth - margin)
      }
      if (side === "top") {
        top = hole.top - cardHeight - gap
        left = Math.min(Math.max(margin, hole.left), window.innerWidth - cardWidth - margin)
      }
      if (side === "right" || side === "left") {
        top = Math.max(margin, Math.min(top, window.innerHeight - cardHeight - margin))
      }
      const right = left + cardWidth
      const bottom = top + cardHeight
      const fits =
        left >= margin &&
        top >= margin &&
        right <= window.innerWidth - margin &&
        bottom <= window.innerHeight - margin
      const covers = left < hole.right && right > hole.left && top < hole.bottom && bottom > hole.top
      if (fits && !covers) {
        placed = { top, left }
        break
      }
    }

    setPlace(
      placed ?? {
        top: Math.max(margin, Math.min(hole.bottom + gap, window.innerHeight - cardHeight - margin)),
        left: Math.max(margin, Math.min(hole.right + gap, window.innerWidth - cardWidth - margin)),
      }
    )
  }, [box, card.title, card.body])

  return (
    <>
      {box && (
        <div
          className="pointer-events-none fixed z-40 rounded-xl ring-2 ring-primary"
          style={{
            top: box.top - 8,
            left: box.left - 8,
            width: box.width + 16,
            height: box.height + 16,
            boxShadow: "0 0 0 9999px rgba(8, 8, 12, 0.55)",
          }}
        />
      )}
      <TourCard ref={cardRef} place={place} {...card} />
    </>
  )
}

const TourCard = forwardRef<
  HTMLDivElement,
  {
    title: string
    body: string
    index: number
    total: number
    atStart: boolean
    atEnd: boolean
    place: { top: number; left: number } | null
    onClose: () => void
    onBack: () => void
    onNext: () => void
  }
>(function TourCard({ title, body, index, total, atStart, atEnd, place, onClose, onBack, onNext }, ref) {
  return (
    <div
      ref={ref}
      role="dialog"
      aria-label="Product tour"
      className="fixed z-50 w-[340px] max-w-[calc(100vw-2rem)] rounded-2xl border border-border/70 bg-card p-5 text-card-foreground shadow-2xl"
      style={{
        top: place?.top ?? 16,
        left: place?.left ?? 16,
        visibility: place ? "visible" : "hidden",
      }}
    >
      <div className="flex items-center justify-between gap-3">
        <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-primary">Product tour</p>
        <button
          type="button"
          aria-label="Close tour"
          onClick={onClose}
          className="grid size-7 place-items-center rounded-md text-muted-foreground hover:bg-accent hover:text-foreground"
        >
          <X className="size-4" />
        </button>
      </div>
      <h2 className="mt-3 text-lg font-semibold tracking-tight">{title}</h2>
      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{body}</p>
      <div className="mt-5 h-1 overflow-hidden rounded-full bg-border">
        <div className="h-full rounded-full bg-primary" style={{ width: `${((index + 1) / total) * 100}%` }} />
      </div>
      <div className="mt-3 flex items-center justify-between gap-3">
        <p className="text-xs text-muted-foreground">
          {index + 1} of {total}
        </p>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onBack}
            disabled={atStart}
            className="inline-flex h-8 items-center gap-1 rounded-md px-2 text-xs font-medium text-muted-foreground hover:text-foreground disabled:pointer-events-none disabled:opacity-30"
          >
            <ChevronLeft className="size-3.5" />
            Back
          </button>
          <button
            type="button"
            onClick={onNext}
            className="inline-flex h-8 items-center gap-1 rounded-md bg-primary px-3 text-xs font-medium text-primary-foreground"
          >
            {atEnd ? "Done" : "Next"}
            {!atEnd && <ChevronRight className="size-3.5" />}
          </button>
        </div>
      </div>
    </div>
  )
})
