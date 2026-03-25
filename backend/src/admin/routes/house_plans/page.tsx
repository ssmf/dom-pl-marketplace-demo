import { defineRouteConfig } from "@medusajs/admin-sdk"
import { Buildings, Plus, Trash, EllipsisHorizontal, PencilSquare } from "@medusajs/icons"
import {
  Button,
  Container,
  Drawer,
  FocusModal,
  Heading,
  Input,
  Label,
  DataTable,
  DataTablePaginationState,
  createDataTableColumnHelper,
  useDataTable,
  Text,
  Textarea,
  toast,
  DropdownMenu,
  IconButton,
  Prompt,
} from "@medusajs/ui"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { useState } from "react"
import { sdk } from "../../lib/client"

type HousePlan = {
  id: string
  title: string
  price: number
  description: string | null
  img: string | null
  house_area: number
  boiler_room_area: number | null
  rooms: number
  bathrooms_and_wc: number
  plot_dimensions: string
  min_plot_dimensions_after_adaptation: string | null
  created_at: string
}

type CreateHousePlanForm = {
  title: string
  price: string
  description: string
  img: string
  house_area: string
  boiler_room_area: string
  rooms: string
  bathrooms_and_wc: string
  plot_dimensions: string
  min_plot_dimensions_after_adaptation: string
}

const initialForm: CreateHousePlanForm = {
  title: "",
  price: "",
  description: "",
  img: "",
  house_area: "",
  boiler_room_area: "",
  rooms: "",
  bathrooms_and_wc: "",
  plot_dimensions: "",
  min_plot_dimensions_after_adaptation: "",
}

const planToForm = (plan: HousePlan): CreateHousePlanForm => ({
  title: plan.title,
  price: String(plan.price),
  description: plan.description ?? "",
  img: plan.img ?? "",
  house_area: String(plan.house_area),
  boiler_room_area: plan.boiler_room_area != null ? String(plan.boiler_room_area) : "",
  rooms: String(plan.rooms),
  bathrooms_and_wc: String(plan.bathrooms_and_wc),
  plot_dimensions: plan.plot_dimensions,
  min_plot_dimensions_after_adaptation: plan.min_plot_dimensions_after_adaptation ?? "",
})

const RowActions = ({ plan }: { plan: HousePlan }) => {
  const [deleteOpen, setDeleteOpen] = useState(false)
  const [editOpen, setEditOpen] = useState(false)
  const [form, setForm] = useState<CreateHousePlanForm>(() => planToForm(plan))
  const [errors, setErrors] = useState<Partial<CreateHousePlanForm>>({})
  const queryClient = useQueryClient()

  const deletePlan = useMutation({
    mutationFn: () =>
      sdk.client.fetch(`/admin/house-plans/${plan.id}`, { method: "DELETE" }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["house_plans"] })
      toast.success("Plan został usunięty")
      setDeleteOpen(false)
    },
    onError: (error: Error) => {
      toast.error(error.message || "Nie udało się usunąć planu")
    },
  })

  const updatePlan = useMutation({
    mutationFn: (data: Record<string, unknown>) =>
      sdk.client.fetch(`/admin/house-plans/${plan.id}`, {
        method: "POST",
        body: data,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["house_plans"] })
      toast.success("Plan został zaktualizowany")
      setEditOpen(false)
    },
    onError: (error: Error) => {
      toast.error(error.message || "Nie udało się zaktualizować planu")
    },
  })

  const validate = () => {
    const newErrors: Partial<CreateHousePlanForm> = {}
    if (!form.title.trim()) newErrors.title = "Tytuł jest wymagany"
    if (!form.price || isNaN(Number(form.price))) newErrors.price = "Podaj poprawną cenę"
    if (!form.house_area || isNaN(Number(form.house_area)))
      newErrors.house_area = "Podaj poprawną powierzchnię"
    if (!form.rooms || isNaN(Number(form.rooms))) newErrors.rooms = "Podaj liczbę pokoi"
    if (!form.bathrooms_and_wc || isNaN(Number(form.bathrooms_and_wc)))
      newErrors.bathrooms_and_wc = "Podaj liczbę łazienek"
    if (!form.plot_dimensions.trim()) newErrors.plot_dimensions = "Wymiary działki są wymagane"
    return newErrors
  }

  const handleUpdate = () => {
    const newErrors = validate()
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }
    const payload: Record<string, unknown> = {
      title: form.title.trim(),
      price: Number(form.price),
      house_area: Number(form.house_area),
      rooms: Number(form.rooms),
      bathrooms_and_wc: Number(form.bathrooms_and_wc),
      plot_dimensions: form.plot_dimensions.trim(),
      description: form.description.trim() || null,
      img: form.img.trim() || null,
      boiler_room_area:
        form.boiler_room_area && !isNaN(Number(form.boiler_room_area))
          ? Number(form.boiler_room_area)
          : null,
      min_plot_dimensions_after_adaptation:
        form.min_plot_dimensions_after_adaptation.trim() || null,
    }
    updatePlan.mutate(payload)
  }

  const field = (
    key: keyof CreateHousePlanForm,
    label: string,
    opts?: { type?: string; required?: boolean }
  ) => (
    <div className="flex flex-col gap-y-1">
      <Label size="small" weight="plus">
        {label}
        {opts?.required && " *"}
      </Label>
      <Input
        type={opts?.type ?? "text"}
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
              setForm(planToForm(plan))
              setErrors({})
              setEditOpen(true)
            }}
          >
            <PencilSquare className="text-ui-fg-subtle" />
            Edytuj
          </DropdownMenu.Item>
          <DropdownMenu.Separator />
          <DropdownMenu.Item
            className="gap-x-2"
            onClick={() => setDeleteOpen(true)}
          >
            <Trash className="text-ui-fg-error" />
            <span className="text-ui-fg-error">Usuń</span>
          </DropdownMenu.Item>
        </DropdownMenu.Content>
      </DropdownMenu>

      <Drawer open={editOpen} onOpenChange={setEditOpen}>
        <Drawer.Content>
          <Drawer.Header>
            <Drawer.Title>Edytuj plan domu</Drawer.Title>
          </Drawer.Header>
          <Drawer.Body className="flex flex-col gap-y-6 overflow-y-auto p-6">
            <div className="flex flex-col gap-y-4">
              <Heading level="h3">Podstawowe informacje</Heading>
              {field("title", "Tytuł", { required: true })}
              {field("price", "Cena (PLN)", { type: "number", required: true })}
              <div className="flex flex-col gap-y-1">
                <Label size="small" weight="plus">Opis</Label>
                <Textarea
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  placeholder="Opis planu domu..."
                  rows={4}
                />
              </div>
              {field("img", "URL zdjęcia")}
            </div>
            <div className="flex flex-col gap-y-4">
              <Heading level="h3">Parametry techniczne</Heading>
              {field("house_area", "Powierzchnia domu (m²)", { type: "number", required: true })}
              {field("boiler_room_area", "Powierzchnia kotłowni (m²)", { type: "number" })}
              {field("rooms", "Liczba pokoi", { type: "number", required: true })}
              {field("bathrooms_and_wc", "Łazienki i WC", { type: "number", required: true })}
              {field("plot_dimensions", "Wymiary działki (np. 15x20)", { required: true })}
              {field("min_plot_dimensions_after_adaptation", "Min. wymiary działki po adaptacji")}
            </div>
          </Drawer.Body>
          <Drawer.Footer>
            <div className="flex items-center justify-end gap-x-2">
              <Drawer.Close asChild>
                <Button size="small" variant="secondary" disabled={updatePlan.isPending}>
                  Anuluj
                </Button>
              </Drawer.Close>
              <Button size="small" onClick={handleUpdate} isLoading={updatePlan.isPending}>
                Zapisz
              </Button>
            </div>
          </Drawer.Footer>
        </Drawer.Content>
      </Drawer>

      <Prompt open={deleteOpen} onOpenChange={setDeleteOpen}>
        <Prompt.Content>
          <Prompt.Header>
            <Prompt.Title>Usuń plan domu</Prompt.Title>
            <Prompt.Description>
              Czy na pewno chcesz usunąć „{plan.title}"? Tej operacji nie można cofnąć.
            </Prompt.Description>
          </Prompt.Header>
          <Prompt.Footer>
            <Prompt.Cancel onClick={() => setDeleteOpen(false)}>Anuluj</Prompt.Cancel>
            <Prompt.Action
              onClick={() => deletePlan.mutate()}
              disabled={deletePlan.isPending}
            >
              Usuń
            </Prompt.Action>
          </Prompt.Footer>
        </Prompt.Content>
      </Prompt>
    </>
  )
}

const columnHelper = createDataTableColumnHelper<HousePlan>()

const getColumns = () => [
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
  columnHelper.display({
    id: "actions",
    header: "",
    cell: ({ row }) => <RowActions plan={row.original} />,
  }),
]

const CreatePlanModal = () => {
  const [open, setOpen] = useState(false)
  const [form, setForm] = useState<CreateHousePlanForm>(initialForm)
  const [errors, setErrors] = useState<Partial<CreateHousePlanForm>>({})
  const queryClient = useQueryClient()

  const createPlan = useMutation({
    mutationFn: (data: Record<string, unknown>) =>
      sdk.client.fetch("/admin/house-plans", {
        method: "POST",
        body: data,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["house_plans"] })
      toast.success("Plan został dodany")
      setOpen(false)
      setForm(initialForm)
      setErrors({})
    },
    onError: (error: Error) => {
      toast.error(error.message || "Nie udało się dodać planu")
    },
  })

  const validate = () => {
    const newErrors: Partial<CreateHousePlanForm> = {}
    if (!form.title.trim()) newErrors.title = "Tytuł jest wymagany"
    if (!form.price || isNaN(Number(form.price))) newErrors.price = "Podaj poprawną cenę"
    if (!form.house_area || isNaN(Number(form.house_area)))
      newErrors.house_area = "Podaj poprawną powierzchnię"
    if (!form.rooms || isNaN(Number(form.rooms))) newErrors.rooms = "Podaj liczbę pokoi"
    if (!form.bathrooms_and_wc || isNaN(Number(form.bathrooms_and_wc)))
      newErrors.bathrooms_and_wc = "Podaj liczbę łazienek"
    if (!form.plot_dimensions.trim()) newErrors.plot_dimensions = "Wymiary działki są wymagane"
    return newErrors
  }

  const handleSubmit = () => {
    const newErrors = validate()
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    const payload: Record<string, unknown> = {
      title: form.title.trim(),
      price: Number(form.price),
      house_area: Number(form.house_area),
      rooms: Number(form.rooms),
      bathrooms_and_wc: Number(form.bathrooms_and_wc),
      plot_dimensions: form.plot_dimensions.trim(),
    }
    if (form.description.trim()) payload.description = form.description.trim()
    if (form.img.trim()) payload.img = form.img.trim()
    if (form.boiler_room_area && !isNaN(Number(form.boiler_room_area)))
      payload.boiler_room_area = Number(form.boiler_room_area)
    if (form.min_plot_dimensions_after_adaptation.trim())
      payload.min_plot_dimensions_after_adaptation =
        form.min_plot_dimensions_after_adaptation.trim()

    createPlan.mutate(payload)
  }

  const field = (
    key: keyof CreateHousePlanForm,
    label: string,
    opts?: { type?: string; required?: boolean }
  ) => (
    <div className="flex flex-col gap-y-1">
      <Label size="small" weight="plus">
        {label}
        {opts?.required && " *"}
      </Label>
      <Input
        type={opts?.type ?? "text"}
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
      <Button size="small" onClick={() => setOpen(true)}>
        <Plus />
        Dodaj plan
      </Button>

      <FocusModal open={open} onOpenChange={setOpen}>
        <FocusModal.Content>
          <div className="flex h-full flex-col overflow-hidden">
            <FocusModal.Header>
              <div className="flex items-center gap-x-2">
                <Heading level="h2">Nowy plan domu</Heading>
              </div>
              <div className="flex items-center gap-x-2 ml-auto">
                <FocusModal.Close asChild>
                  <Button
                    size="small"
                    variant="secondary"
                    disabled={createPlan.isPending}
                  >
                    Anuluj
                  </Button>
                </FocusModal.Close>
                <Button
                  size="small"
                  onClick={handleSubmit}
                  isLoading={createPlan.isPending}
                >
                  Zapisz
                </Button>
              </div>
            </FocusModal.Header>

            <FocusModal.Body className="flex-1 overflow-auto">
              <div className="mx-auto max-w-2xl px-6 py-8 flex flex-col gap-y-6">
                <div className="flex flex-col gap-y-4">
                  <Heading level="h3">Podstawowe informacje</Heading>
                  {field("title", "Tytuł", { required: true })}
                  {field("price", "Cena (PLN)", { type: "number", required: true })}
                  <div className="flex flex-col gap-y-1">
                    <Label size="small" weight="plus">Opis</Label>
                    <Textarea
                      value={form.description}
                      onChange={(e) => setForm({ ...form, description: e.target.value })}
                      placeholder="Opis planu domu..."
                      rows={4}
                    />
                  </div>
                  {field("img", "URL zdjęcia")}
                </div>

                <div className="flex flex-col gap-y-4">
                  <Heading level="h3">Parametry techniczne</Heading>
                  <div className="grid grid-cols-2 gap-4">
                    {field("house_area", "Powierzchnia domu (m²)", { type: "number", required: true })}
                    {field("boiler_room_area", "Powierzchnia kotłowni (m²)", { type: "number" })}
                    {field("rooms", "Liczba pokoi", { type: "number", required: true })}
                    {field("bathrooms_and_wc", "Łazienki i WC", { type: "number", required: true })}
                  </div>
                  {field("plot_dimensions", "Wymiary działki (np. 15x20)", { required: true })}
                  {field(
                    "min_plot_dimensions_after_adaptation",
                    "Min. wymiary działki po adaptacji"
                  )}
                </div>
              </div>
            </FocusModal.Body>
          </div>
        </FocusModal.Content>
      </FocusModal>
    </>
  )
}

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

  const columns = getColumns()

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
        <CreatePlanModal />
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
