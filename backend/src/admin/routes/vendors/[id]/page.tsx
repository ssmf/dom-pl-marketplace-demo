import {
  Container,
  Heading,
  Text,
  Avatar,
  Badge,
  DataTable,
  DataTablePaginationState,
  createDataTableColumnHelper,
  useDataTable,
  StatusBadge,
} from "@medusajs/ui"
import { ArrowLeft } from "@medusajs/icons"
import { useQuery } from "@tanstack/react-query"
import { useParams, useNavigate } from "react-router-dom"
import { useState } from "react"
import { sdk } from "../../../lib/client"

type Vendor = {
  id: string
  company_name: string
  first_name: string
  last_name: string
  email: string
  house_plans_count: number
  revenue: number
  average_rating: number | null
  created_at: string
}

type HousePlan = {
  id: string
  title: string
  price: number
  img: string | null
  house_area: number
  rooms: number
  bathrooms_and_wc: number
  plot_dimensions: string
  product?: { id: string } | null
}

type VendorOrder = {
  id: string
  status: string
  created_at: string
  total: number
  email: string
  items: Array<{ id: string; title: string; quantity: number; unit_price: number }>
}

const formatPLN = (value: number) =>
  Number(value).toLocaleString("pl-PL", {
    style: "currency",
    currency: "PLN",
    maximumFractionDigits: 0,
  })

// ─── House plans table ────────────────────────────────────────────────────────

const planColumnHelper = createDataTableColumnHelper<HousePlan>()

const planColumns = [
  planColumnHelper.accessor("title", {
    header: "Tytuł projektu",
    cell: ({ getValue }) => (
      <Text size="small" leading="compact" weight="plus">
        {getValue()}
      </Text>
    ),
  }),
  planColumnHelper.accessor("price", {
    header: "Cena",
    cell: ({ getValue }) => (
      <Text size="small" leading="compact">{formatPLN(getValue())}</Text>
    ),
  }),
  planColumnHelper.accessor("house_area", {
    header: "Pow. użytkowa",
    cell: ({ getValue }) => (
      <Text size="small" leading="compact">{getValue()} m²</Text>
    ),
  }),
  planColumnHelper.accessor("rooms", {
    header: "Pokoje",
    cell: ({ getValue }) => (
      <Text size="small" leading="compact">{getValue()}</Text>
    ),
  }),
  planColumnHelper.accessor("bathrooms_and_wc", {
    header: "Łazienki/WC",
    cell: ({ getValue }) => (
      <Text size="small" leading="compact">{getValue()}</Text>
    ),
  }),
  planColumnHelper.accessor("plot_dimensions", {
    header: "Wymiary działki",
    cell: ({ getValue }) => (
      <Text size="small" leading="compact" className="text-ui-fg-subtle">
        {getValue()}
      </Text>
    ),
  }),
]

// ─── Orders table ─────────────────────────────────────────────────────────────

const orderColumnHelper = createDataTableColumnHelper<VendorOrder>()

const ORDER_STATUS_MAP: Record<string, { label: string; color: "green" | "orange" | "blue" | "grey" | "red" }> = {
  completed:  { label: "Zrealizowane", color: "green" },
  pending:    { label: "Oczekujące",   color: "orange" },
  processing: { label: "W realizacji", color: "blue" },
  cancelled:  { label: "Anulowane",    color: "red" },
}

const orderColumns = [
  orderColumnHelper.accessor("id", {
    header: "ID zamówienia",
    cell: ({ getValue }) => (
      <Text size="small" leading="compact" className="text-ui-fg-subtle font-mono">
        #{getValue().slice(-8).toUpperCase()}
      </Text>
    ),
  }),
  orderColumnHelper.accessor("email", {
    header: "Klient",
    cell: ({ getValue }) => (
      <Text size="small" leading="compact">{getValue()}</Text>
    ),
  }),
  orderColumnHelper.accessor("items", {
    header: "Projekt",
    cell: ({ getValue }) => {
      const items = getValue()
      return (
        <Text size="small" leading="compact">
          {items.map((i) => i.title).join(", ")}
        </Text>
      )
    },
  }),
  orderColumnHelper.accessor("total", {
    header: "Kwota",
    cell: ({ getValue }) => (
      <Text size="small" leading="compact" weight="plus">
        {formatPLN(getValue())}
      </Text>
    ),
  }),
  orderColumnHelper.accessor("status", {
    header: "Status",
    cell: ({ getValue }) => {
      const s = ORDER_STATUS_MAP[getValue()] ?? { label: getValue(), color: "grey" as const }
      return <StatusBadge color={s.color}>{s.label}</StatusBadge>
    },
  }),
  orderColumnHelper.accessor("created_at", {
    header: "Data",
    cell: ({ getValue }) => (
      <Text size="small" leading="compact" className="text-ui-fg-subtle">
        {new Date(getValue()).toLocaleDateString("pl-PL")}
      </Text>
    ),
  }),
]

// ─── Page component ───────────────────────────────────────────────────────────

const VendorDetailPage = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [planPagination, setPlanPagination] = useState<DataTablePaginationState>({ pageIndex: 0, pageSize: 10 })
  const [orderPagination, setOrderPagination] = useState<DataTablePaginationState>({ pageIndex: 0, pageSize: 10 })

  const { data: vendorData, isLoading: vendorLoading } = useQuery({
    queryKey: ["vendor", id],
    queryFn: () => sdk.client.fetch<{ vendor: Vendor }>(`/admin/vendors/${id}`),
    enabled: !!id,
  })

  const { data: plansData, isLoading: plansLoading } = useQuery({
    queryKey: ["vendor-house-plans", id],
    queryFn: () => sdk.client.fetch<{ house_plans: HousePlan[] }>(`/admin/vendors/${id}/house-plans`),
    enabled: !!id,
  })

  const { data: ordersData, isLoading: ordersLoading } = useQuery({
    queryKey: ["vendor-orders", id],
    queryFn: () => sdk.client.fetch<{ orders: VendorOrder[] }>(`/admin/vendors/${id}/orders`),
    enabled: !!id,
  })

  const vendor = vendorData?.vendor
  const housePlans = plansData?.house_plans ?? []
  const orders = ordersData?.orders ?? []

  const paginatedPlans = housePlans.slice(
    planPagination.pageIndex * planPagination.pageSize,
    (planPagination.pageIndex + 1) * planPagination.pageSize
  )

  const paginatedOrders = orders.slice(
    orderPagination.pageIndex * orderPagination.pageSize,
    (orderPagination.pageIndex + 1) * orderPagination.pageSize
  )

  const planTable = useDataTable({
    data: paginatedPlans,
    columns: planColumns,
    getRowId: (row) => row.id,
    rowCount: housePlans.length,
    isLoading: plansLoading,
    onRowClick: (_, row) => {
      const productId = (row as any).original?.product?.id
      if (productId) navigate(`/products/${productId}`)
    },
    pagination: { state: planPagination, onPaginationChange: setPlanPagination },
  })

  const orderTable = useDataTable({
    data: paginatedOrders,
    columns: orderColumns,
    getRowId: (row) => row.id,
    rowCount: orders.length,
    isLoading: ordersLoading,
    onRowClick: (_, row) => {
      const orderId = (row as any).original?.id
      if (orderId) navigate(`/orders/${orderId}`)
    },
    pagination: { state: orderPagination, onPaginationChange: setOrderPagination },
  })

  if (vendorLoading) {
    return (
      <div className="flex items-center justify-center p-16">
        <Text size="small" leading="compact" className="text-ui-fg-subtle">Ładowanie...</Text>
      </div>
    )
  }

  if (!vendor) {
    return (
      <div className="flex items-center justify-center p-16">
        <Text size="small" leading="compact" className="text-ui-fg-subtle">Sprzedawca nie znaleziony</Text>
      </div>
    )
  }

  const initials = `${vendor.first_name[0] ?? ""}${vendor.last_name[0] ?? ""}`.toUpperCase()

  return (
    <div className="flex flex-col gap-y-4 p-4">
      {/* Back button */}
      <button
        onClick={() => navigate("/vendors")}
        className="flex items-center gap-x-2 text-ui-fg-subtle hover:text-ui-fg-base w-fit transition-colors"
      >
        <ArrowLeft className="size-4" />
        <Text size="small" leading="compact">Wróć do listy</Text>
      </button>

      {/* Vendor info */}
      <Container>
        <div className="flex flex-col gap-y-6 px-6 py-4">
          <div className="flex items-center gap-x-4">
            <Avatar size="xlarge" fallback={initials} />
            <div className="flex flex-col gap-y-1">
              <Heading level="h1">{vendor.company_name}</Heading>
              <Text size="small" leading="compact" className="text-ui-fg-subtle">
                {vendor.first_name} {vendor.last_name}
              </Text>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            <InfoTile label="E-mail" value={vendor.email} />
            <InfoTile label="Projekty" value={String(vendor.house_plans_count)} />
            <InfoTile label="Zamówienia" value={String(orders.length)} />
            <InfoTile
              label="Przychód"
              value={formatPLN(vendor.revenue)}
            />
            <InfoTile
              label="Ocena"
              value={vendor.average_rating != null ? `${vendor.average_rating} / 5` : "—"}
            />
            <InfoTile
              label="Dołączył"
              value={new Date(vendor.created_at).toLocaleDateString("pl-PL")}
            />
          </div>
        </div>
      </Container>

      {/* Orders */}
      <Container className="p-0">
        <div className="flex items-center justify-between px-6 py-4">
          <div className="flex items-center gap-x-3">
            <Heading level="h2">Zamówienia</Heading>
            <Badge size="2xsmall" color={orders.length > 0 ? "green" : "grey"}>
              {orders.length}
            </Badge>
          </div>
        </div>

        {orders.length === 0 && !ordersLoading ? (
          <div className="px-6 pb-6">
            <Text size="small" leading="compact" className="text-ui-fg-subtle">
              Brak zamówień dla tego sprzedawcy.
            </Text>
          </div>
        ) : (
          <DataTable instance={orderTable}>
            <DataTable.Table />
            <DataTable.Pagination />
          </DataTable>
        )}
      </Container>

      {/* House plans */}
      <Container className="p-0">
        <div className="flex items-center justify-between px-6 py-4">
          <div className="flex items-center gap-x-3">
            <Heading level="h2">Plany domów</Heading>
            <Badge size="2xsmall" color="grey">{housePlans.length}</Badge>
          </div>
        </div>

        <DataTable instance={planTable}>
          <DataTable.Table />
          <DataTable.Pagination />
        </DataTable>
      </Container>
    </div>
  )
}

const InfoTile = ({ label, value }: { label: string; value: string }) => (
  <div className="shadow-elevation-card-rest bg-ui-bg-component rounded-md px-4 py-3 flex flex-col gap-y-1">
    <Text size="small" leading="compact" className="text-ui-fg-subtle">{label}</Text>
    <Text size="small" leading="compact" weight="plus">{value}</Text>
  </div>
)

export default VendorDetailPage
