import { defineRouteConfig } from "@medusajs/admin-sdk"
import { BuildingStorefront, EllipsisHorizontal, PencilSquare } from "@medusajs/icons"
import {
  Container,
  DataTable,
  DataTablePaginationState,
  createDataTableColumnHelper,
  useDataTable,
  Heading,
  Text,
  Avatar,
  Drawer,
  Button,
  Input,
  Label,
  DropdownMenu,
  IconButton,
  toast,
} from "@medusajs/ui"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { sdk } from "../../lib/client"

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

type EditForm = {
  company_name: string
  first_name: string
  last_name: string
  email: string
}

const RowActions = ({ vendor }: { vendor: Vendor }) => {
  const [open, setOpen] = useState(false)
  const [form, setForm] = useState<EditForm>({
    company_name: vendor.company_name,
    first_name: vendor.first_name,
    last_name: vendor.last_name,
    email: vendor.email,
  })
  const [errors, setErrors] = useState<Partial<EditForm>>({})
  const queryClient = useQueryClient()

  const updateVendor = useMutation({
    mutationFn: (data: Partial<EditForm>) =>
      sdk.client.fetch(`/admin/vendors/${vendor.id}`, { method: "POST", body: data }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["vendors"] })
      toast.success("Sprzedawca został zaktualizowany")
      setOpen(false)
    },
    onError: (error: Error) => {
      toast.error(error.message || "Nie udało się zaktualizować sprzedawcy")
    },
  })

  const validate = () => {
    const e: Partial<EditForm> = {}
    if (!form.company_name.trim()) e.company_name = "Nazwa firmy jest wymagana"
    if (!form.first_name.trim()) e.first_name = "Imię jest wymagane"
    if (!form.last_name.trim()) e.last_name = "Nazwisko jest wymagane"
    if (!form.email.trim()) e.email = "E-mail jest wymagany"
    return e
  }

  const handleSave = () => {
    const e = validate()
    if (Object.keys(e).length > 0) { setErrors(e); return }
    updateVendor.mutate({
      company_name: form.company_name.trim(),
      first_name: form.first_name.trim(),
      last_name: form.last_name.trim(),
      email: form.email.trim(),
    })
  }

  const field = (key: keyof EditForm, label: string) => (
    <div className="flex flex-col gap-y-1">
      <Label size="small" weight="plus">{label} *</Label>
      <Input
        value={form[key]}
        onChange={(e) => {
          setForm({ ...form, [key]: e.target.value })
          setErrors({ ...errors, [key]: undefined })
        }}
        placeholder={label}
      />
      {errors[key] && (
        <Text size="small" leading="compact" className="text-ui-fg-error">
          {errors[key]}
        </Text>
      )}
    </div>
  )

  return (
    <>
      <DropdownMenu>
        <DropdownMenu.Trigger asChild>
          <IconButton size="small" variant="transparent">
            <EllipsisHorizontal />
          </IconButton>
        </DropdownMenu.Trigger>
        <DropdownMenu.Content>
          <DropdownMenu.Item
            className="gap-x-2"
            onClick={() => {
              setForm({
                company_name: vendor.company_name,
                first_name: vendor.first_name,
                last_name: vendor.last_name,
                email: vendor.email,
              })
              setErrors({})
              setOpen(true)
            }}
          >
            <PencilSquare className="text-ui-fg-subtle" />
            Edytuj
          </DropdownMenu.Item>
        </DropdownMenu.Content>
      </DropdownMenu>

      <Drawer open={open} onOpenChange={setOpen}>
        <Drawer.Content>
          <Drawer.Header>
            <Drawer.Title>Edytuj sprzedawcę</Drawer.Title>
          </Drawer.Header>
          <Drawer.Body className="flex flex-col gap-y-6 overflow-y-auto p-6">
            {field("company_name", "Nazwa firmy")}
            {field("first_name", "Imię")}
            {field("last_name", "Nazwisko")}
            {field("email", "E-mail")}
          </Drawer.Body>
          <Drawer.Footer>
            <div className="flex items-center justify-end gap-x-2">
              <Drawer.Close asChild>
                <Button size="small" variant="secondary" disabled={updateVendor.isPending}>
                  Anuluj
                </Button>
              </Drawer.Close>
              <Button size="small" onClick={handleSave} isLoading={updateVendor.isPending}>
                Zapisz
              </Button>
            </div>
          </Drawer.Footer>
        </Drawer.Content>
      </Drawer>
    </>
  )
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
  columnHelper.accessor("house_plans_count", {
    header: "Plany",
    cell: ({ getValue }) => (
      <Text size="small" leading="compact">
        {getValue() as number}
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
  columnHelper.display({
    id: "actions",
    header: "",
    cell: ({ row }) => <RowActions vendor={row.original} />,
  }),
]

const VendorsPage = () => {
  const navigate = useNavigate()
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
    onRowClick: (_, row) => navigate(`/vendors/${row.id}`),
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
          {/* <Text size="small" leading="compact" className="text-ui-fg-subtle">
            {isLoading ? "Ładowanie..." : `${filtered.length} sprzedawców`}
          </Text> */}
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
