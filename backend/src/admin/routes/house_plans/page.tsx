import { defineRouteConfig } from "@medusajs/admin-sdk"
import { Buildings } from "@medusajs/icons"
import {
  Container,
  Heading,
  DataTable,
  DataTablePaginationState,
  createDataTableColumnHelper,
  useDataTable,
  Text,
} from "@medusajs/ui"
import { useQuery } from "@tanstack/react-query"
import { useState } from "react"
import { sdk } from "../../lib/client"

type HousePlan = {
  id: string
  title: string
  price: number
  description: string | null
  house_area: number
  boiler_room_area: number | null
  rooms: number
  bathrooms_and_wc: number
  plot_dimensions: string
  min_plot_dimensions_after_adaptation: string | null
  created_at: string
}

const columnHelper = createDataTableColumnHelper<HousePlan>()

const columns = [
  columnHelper.accessor("title", {
    header: "Tytuł",
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
        {getValue().toLocaleString("pl-PL", {
          style: "currency",
          currency: "PLN",
        })}
      </Text>
    ),
  }),
  columnHelper.accessor("house_area", {
    header: "Pow. domu",
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
    header: "Łazienki / WC",
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
        {getValue()} m
      </Text>
    ),
  }),
  columnHelper.accessor("created_at", {
    header: "Dodano",
    cell: ({ getValue }) => (
      <Text size="small" leading="compact" className="text-ui-fg-subtle">
        {new Date(getValue()).toLocaleDateString("pl-PL")}
      </Text>
    ),
  }),
]

const HousePlansPage = () => {
  const [searchValue, setSearchValue] = useState("")
  const [pagination, setPagination] = useState<DataTablePaginationState>({
    pageIndex: 0,
    pageSize: 15,
  })

  const { data, isLoading } = useQuery({
    queryKey: ["house_plans"],
    queryFn: () =>
      sdk.client.fetch<{ house_plans: HousePlan[] }>("/admin/house-plans"),
  })

  const allPlans = data?.house_plans ?? []

  const filtered = allPlans.filter((p) =>
    p.title.toLowerCase().includes(searchValue.toLowerCase())
  )

  const { pageIndex, pageSize } = pagination
  const paginated = filtered.slice(
    pageIndex * pageSize,
    (pageIndex + 1) * pageSize
  )

  const table = useDataTable({
    data: paginated,
    columns,
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
        <Heading level="h1">Plany domów</Heading>
      </div>

      <DataTable instance={table}>
        <DataTable.Toolbar className="px-6 py-4">
          <DataTable.Search placeholder="Szukaj planów..." />
        </DataTable.Toolbar>
        <DataTable.Table />
        <DataTable.Pagination />
      </DataTable>
    </Container>
  )
}

export const config = defineRouteConfig({
  label: "Plany domów",
  icon: Buildings,
})

export default HousePlansPage
