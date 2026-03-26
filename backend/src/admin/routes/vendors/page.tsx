import { defineRouteConfig } from "@medusajs/admin-sdk"
import { BuildingStorefront } from "@medusajs/icons"
import {
  Container,
  DataTable,
  DataTablePaginationState,
  createDataTableColumnHelper,
  useDataTable,
  Heading,
  Text,
  Avatar,
} from "@medusajs/ui"
import { useQuery } from "@tanstack/react-query"
import { useState } from "react"
import { sdk } from "../../lib/client"

type Vendor = {
  id: string
  company_name: string
  first_name: string
  last_name: string
  email: string
  published_plans_count: number
  revenue: number
  orders_count: number
  average_rating: number | null
  created_at: string
}

const columnHelper = createDataTableColumnHelper<Vendor>()

const getColumns = () => [
  columnHelper.display({
    id: "name",
    header: "Sprzedawca",
    cell: ({ row }) => {
      const v = row.original
      const initials = `${v.first_name[0] ?? ""}${v.last_name[0] ?? ""}`.toUpperCase()
      return (
        <div className="flex items-center gap-x-3">
          <Avatar size="small" fallback={initials} />
          <div className="flex flex-col">
            <Text size="small" leading="compact" weight="plus">
              {v.company_name}
            </Text>
            <Text size="small" leading="compact" className="text-ui-fg-subtle">
              {v.first_name} {v.last_name}
            </Text>
          </div>
        </div>
      )
    },
  }),
  columnHelper.accessor("email", {
    header: "E-mail",
    cell: ({ getValue }) => (
      <Text size="small" leading="compact" className="text-ui-fg-subtle">
        {getValue()}
      </Text>
    ),
  }),
  columnHelper.accessor("published_plans_count", {
    header: "Plany",
    cell: ({ getValue }) => (
      <Text size="small" leading="compact">
        {getValue()}
      </Text>
    ),
  }),
  columnHelper.accessor("orders_count", {
    header: "Zamówienia",
    cell: ({ getValue }) => (
      <Text size="small" leading="compact">
        {getValue()}
      </Text>
    ),
  }),
  columnHelper.accessor("revenue", {
    header: "Przychód",
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
  columnHelper.accessor("average_rating", {
    header: "Ocena",
    cell: ({ getValue }) => {
      const val = getValue()
      return (
        <Text size="small" leading="compact">
          {val != null ? `${val} / 5` : "—"}
        </Text>
      )
    },
  }),
  columnHelper.accessor("created_at", {
    header: "Dołączył",
    cell: ({ getValue }) => (
      <Text size="small" leading="compact" className="text-ui-fg-subtle">
        {new Date(getValue()).toLocaleDateString("pl-PL")}
      </Text>
    ),
  }),
]

const VendorsPage = () => {
  const [searchValue, setSearchValue] = useState("")
  const [pagination, setPagination] = useState<DataTablePaginationState>({
    pageIndex: 0,
    pageSize: 15,
  })

  const { data, isLoading } = useQuery({
    queryKey: ["vendors"],
    queryFn: () =>
      sdk.client.fetch<{ vendors: Vendor[]; count: number }>("/admin/vendors"),
  })

  const allVendors = data?.vendors ?? []

  const filtered = allVendors.filter(
    (v) =>
      v.company_name.toLowerCase().includes(searchValue.toLowerCase()) ||
      v.email.toLowerCase().includes(searchValue.toLowerCase()) ||
      `${v.first_name} ${v.last_name}`.toLowerCase().includes(searchValue.toLowerCase())
  )

  const { pageIndex, pageSize } = pagination
  const paginated = filtered.slice(pageIndex * pageSize, (pageIndex + 1) * pageSize)

  const table = useDataTable({
    data: paginated,
    columns: getColumns(),
    getRowId: (row) => row.id,
    rowCount: filtered.length,
    isLoading,
    search: {
      state: searchValue,
      onSearchChange: (val) => {
        setSearchValue(val)
        setPagination((p) => ({ ...p, pageIndex: 0 }))
      },
    },
    pagination: {
      state: pagination,
      onPaginationChange: setPagination,
    },
  })

  return (
    <Container className="p-0">
      <div className="flex items-center justify-between px-6 py-4">
        <div className="flex flex-col gap-y-1">
          <Heading level="h1">Sprzedawcy</Heading>
          <Text size="small" leading="compact" className="text-ui-fg-subtle">
            {isLoading ? "Ładowanie..." : `${filtered.length} sprzedawców`}
          </Text>
        </div>
      </div>

      <DataTable instance={table}>
        <DataTable.Toolbar className="px-6 py-4">
          <DataTable.Search placeholder="Szukaj sprzedawcy..." />
        </DataTable.Toolbar>
        <DataTable.Table />
        <DataTable.Pagination />
      </DataTable>
    </Container>
  )
}

export const config = defineRouteConfig({
  label: "Sprzedawcy",
  icon: BuildingStorefront,
})

export default VendorsPage
