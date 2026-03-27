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
<<<<<<< HEAD
  product?: { id: string } | null
=======
>>>>>>> f2dc3937df0d9bf6da12cee8b26bdde84e0ebc63
}

const columnHelper = createDataTableColumnHelper<HousePlan>()

const columns = [
  columnHelper.accessor("title", {
    header: "Tytuł projektu",
    cell: ({ getValue }) => (
      <Text size="small" leading="compact" weight="plus">
        {getValue()}
      </Text>
    ),
  }),
  columnHelper.accessor("price", {
    header: "Cena",
    cell: ({ getValue }) => (
      <Text size="small" leading="compact">
        {Number(getValue()).toLocaleString("pl-PL", {
          style: "currency",
          currency: "PLN",
          maximumFractionDigits: 0,
        })}
      </Text>
    ),
  }),
  columnHelper.accessor("house_area", {
    header: "Pow. użytkowa",
    cell: ({ getValue }) => (
      <Text size="small" leading="compact">
        {getValue()} m²
      </Text>
    ),
  }),
  columnHelper.accessor("rooms", {
    header: "Pokoje",
    cell: ({ getValue }) => (
      <Text size="small" leading="compact">
        {getValue()}
      </Text>
    ),
  }),
  columnHelper.accessor("bathrooms_and_wc", {
    header: "Łazienki/WC",
    cell: ({ getValue }) => (
      <Text size="small" leading="compact">
        {getValue()}
      </Text>
    ),
  }),
  columnHelper.accessor("plot_dimensions", {
    header: "Wymiary działki",
    cell: ({ getValue }) => (
      <Text size="small" leading="compact" className="text-ui-fg-subtle">
        {getValue()}
      </Text>
    ),
  }),
]

const VendorDetailPage = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [pagination, setPagination] = useState<DataTablePaginationState>({
    pageIndex: 0,
    pageSize: 10,
  })

  const { data: vendorData, isLoading: vendorLoading } = useQuery({
    queryKey: ["vendor", id],
    queryFn: () => sdk.client.fetch<{ vendor: Vendor }>(`/admin/vendors/${id}`),
    enabled: !!id,
  })

  const { data: plansData, isLoading: plansLoading } = useQuery({
    queryKey: ["vendor-house-plans", id],
    queryFn: () =>
      sdk.client.fetch<{ house_plans: HousePlan[] }>(
        `/admin/vendors/${id}/house-plans`
      ),
    enabled: !!id,
  })

  const vendor = vendorData?.vendor
  const housePlans = plansData?.house_plans ?? []

  const { pageIndex, pageSize } = pagination
  const paginated = housePlans.slice(pageIndex * pageSize, (pageIndex + 1) * pageSize)

  const table = useDataTable({
    data: paginated,
    columns,
    getRowId: (row) => row.id,
    rowCount: housePlans.length,
    isLoading: plansLoading,
<<<<<<< HEAD
    onRowClick: (_, row) => {
      const productId = (row as any).original?.product?.id
      if (productId) navigate(`/products/${productId}`)
    },
=======
>>>>>>> f2dc3937df0d9bf6da12cee8b26bdde84e0ebc63
    pagination: {
      state: pagination,
      onPaginationChange: setPagination,
    },
  })

  if (vendorLoading) {
    return (
      <div className="flex items-center justify-center p-16">
        <Text size="small" leading="compact" className="text-ui-fg-subtle">
          Ładowanie...
        </Text>
      </div>
    )
  }

  if (!vendor) {
    return (
      <div className="flex items-center justify-center p-16">
        <Text size="small" leading="compact" className="text-ui-fg-subtle">
          Sprzedawca nie znaleziony
        </Text>
      </div>
    )
  }

  const initials =
    `${vendor.first_name[0] ?? ""}${vendor.last_name[0] ?? ""}`.toUpperCase()

  return (
    <div className="flex flex-col gap-y-4 p-4">
      {/* Back button */}
      <button
        onClick={() => navigate("/vendors")}
        className="flex items-center gap-x-2 text-ui-fg-subtle hover:text-ui-fg-base w-fit transition-colors"
      >
        <ArrowLeft className="size-4" />
        <Text size="small" leading="compact">
          Wróć do listy
        </Text>
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
            <InfoTile
              label="Projekty"
              value={String(vendor.house_plans_count)}
            />
            <InfoTile
              label="Przychód"
              value={Number(vendor.revenue).toLocaleString("pl-PL", {
                style: "currency",
                currency: "PLN",
                maximumFractionDigits: 0,
              })}
            />
            <InfoTile
              label="Ocena"
              value={
                vendor.average_rating != null
                  ? `${vendor.average_rating} / 5`
                  : "—"
              }
            />
            <InfoTile
              label="Dołączył"
              value={new Date(vendor.created_at).toLocaleDateString("pl-PL")}
            />
          </div>
        </div>
      </Container>

      {/* House plans */}
      <Container className="p-0">
        <div className="flex items-center justify-between px-6 py-4">
          <div className="flex items-center gap-x-3">
            <Heading level="h2">Plany domów</Heading>
            <Badge size="2xsmall" color="grey">
              {housePlans.length}
            </Badge>
          </div>
        </div>

        <DataTable instance={table}>
          <DataTable.Table />
          <DataTable.Pagination />
        </DataTable>
      </Container>
    </div>
  )
}

const InfoTile = ({ label, value }: { label: string; value: string }) => (
  <div className="shadow-elevation-card-rest bg-ui-bg-component rounded-md px-4 py-3 flex flex-col gap-y-1">
    <Text size="small" leading="compact" className="text-ui-fg-subtle">
      {label}
    </Text>
    <Text size="small" leading="compact" weight="plus">
      {value}
    </Text>
  </div>
)

export default VendorDetailPage
