import { defineWidgetConfig } from "@medusajs/admin-sdk"
import {
  Button,
  Container,
  Drawer,
  Heading,
  Input,
  Label,
  Text,
  Textarea,
  toast,
} from "@medusajs/ui"
import type { DetailWidgetProps, AdminProduct } from "@medusajs/framework/types"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { useState } from "react"
import { sdk } from "../lib/client"

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
  updated_at: string
}

type EditForm = {
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

const planToForm = (plan: HousePlan): EditForm => ({
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

const formatPLN = (value: number) =>
  value.toLocaleString("pl-PL", { style: "currency", currency: "PLN", maximumFractionDigits: 0 })

const DetailRow = ({ label, value }: { label: string; value: string | number | null }) => (
  <div className="flex items-center justify-between py-2 border-b border-ui-border-base last:border-0">
    <Text size="small" leading="compact" className="text-ui-fg-subtle">
      {label}
    </Text>
    <Text size="small" leading="compact" weight="plus">
      {value ?? "—"}
    </Text>
  </div>
)

const HousePlanDetailsWidget = ({ data: product }: DetailWidgetProps<AdminProduct>) => {
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [form, setForm] = useState<EditForm | null>(null)
  const [errors, setErrors] = useState<Partial<EditForm>>({})
  const queryClient = useQueryClient()

  const queryKey = ["house-plan-by-product", product.id]

  const { data, isLoading } = useQuery({
    queryKey,
    queryFn: () =>
      sdk.client.fetch<{ house_plan: HousePlan | null }>(
        `/admin/products/${product.id}/house-plan`
      ),
  })

  const housePlan = data?.house_plan ?? null

  const updateMutation = useMutation({
    mutationFn: (payload: Record<string, unknown>) =>
      sdk.client.fetch(`/admin/products/${product.id}/house-plan`, {
        method: "POST",
        body: payload,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey })
      toast.success("Plan domu zaktualizowany")
      setDrawerOpen(false)
    },
    onError: (error: Error) => {
      toast.error(error.message || "Nie udało się zaktualizować planu")
    },
  })

  const validate = (f: EditForm): Partial<EditForm> => {
    const e: Partial<EditForm> = {}
    if (!f.title.trim()) e.title = "Tytuł jest wymagany"
    if (!f.price || isNaN(Number(f.price))) e.price = "Podaj poprawną cenę"
    if (!f.house_area || isNaN(Number(f.house_area))) e.house_area = "Podaj powierzchnię"
    if (!f.rooms || isNaN(Number(f.rooms))) e.rooms = "Podaj liczbę pokoi"
    if (!f.bathrooms_and_wc || isNaN(Number(f.bathrooms_and_wc)))
      e.bathrooms_and_wc = "Podaj liczbę łazienek"
    if (!f.plot_dimensions.trim()) e.plot_dimensions = "Wymiary działki są wymagane"
    return e
  }

  const handleSave = () => {
    if (!form) return
    const e = validate(form)
    if (Object.keys(e).length > 0) { setErrors(e); return }

    updateMutation.mutate({
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
    })
  }

  const field = (key: keyof EditForm, label: string, opts?: { type?: string; required?: boolean }) => {
    if (!form) return null
    return (
      <div className="flex flex-col gap-y-1">
        <Label size="small" weight="plus">
          {label}{opts?.required && " *"}
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
  }

  if (isLoading) {
    return (
      <Container className="px-6 py-4">
        <Text size="small" leading="compact" className="text-ui-fg-subtle">
          Ładowanie danych planu...
        </Text>
      </Container>
    )
  }

  if (!housePlan) {
    return (
      <Container className="px-6 py-4">
        <Text size="small" leading="compact" className="text-ui-fg-subtle">
          Brak powiązanego planu domu z tym produktem.
        </Text>
      </Container>
    )
  }

  return (
    <>
      <Container className="px-6 py-4 divide-y divide-ui-border-base">
        <div className="flex items-center justify-between pb-4">
          <Heading level="h2">Plan domu</Heading>
          <Button
            size="small"
            variant="secondary"
            onClick={() => {
              setForm(planToForm(housePlan))
              setErrors({})
              setDrawerOpen(true)
            }}
          >
            Edytuj
          </Button>
        </div>

        {housePlan.img && (
          <div className="py-4">
            <div className="aspect-video overflow-hidden rounded-lg border border-ui-border-base bg-ui-bg-subtle flex items-center justify-center">
              <img
                src={housePlan.img}
                alt={housePlan.title}
                className="max-h-full max-w-full object-contain"
              />
            </div>
          </div>
        )}

        <div className="pt-0 space-y-0">
          <DetailRow label="Cena" value={formatPLN(housePlan.price)} />
          <DetailRow label="Powierzchnia domu" value={`${housePlan.house_area} m²`} />
          {housePlan.boiler_room_area != null && (
            <DetailRow label="Powierzchnia kotłowni" value={`${housePlan.boiler_room_area} m²`} />
          )}
          <DetailRow label="Liczba pokoi" value={housePlan.rooms} />
          <DetailRow label="Łazienki i WC" value={housePlan.bathrooms_and_wc} />
          <DetailRow label="Wymiary działki" value={`${housePlan.plot_dimensions} m`} />
          {housePlan.min_plot_dimensions_after_adaptation && (
            <DetailRow
              label="Min. wymiary po adaptacji"
              value={housePlan.min_plot_dimensions_after_adaptation}
            />
          )}
          {housePlan.description && (
            <div className="py-3">
              <Text size="small" leading="compact" className="text-ui-fg-subtle mb-1">
                Opis
              </Text>
              <Text size="small" leading="compact">
                {housePlan.description}
              </Text>
            </div>
          )}
        </div>
      </Container>

      <Drawer open={drawerOpen} onOpenChange={setDrawerOpen}>
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
                {form && (
                  <Textarea
                    value={form.description}
                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                    placeholder="Opis planu domu..."
                    rows={4}
                  />
                )}
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
                <Button size="small" variant="secondary" disabled={updateMutation.isPending}>
                  Anuluj
                </Button>
              </Drawer.Close>
              <Button size="small" onClick={handleSave} isLoading={updateMutation.isPending}>
                Zapisz
              </Button>
            </div>
          </Drawer.Footer>
        </Drawer.Content>
      </Drawer>
    </>
  )
}

export const config = defineWidgetConfig({
  zone: "product.details.after",
})

export default HousePlanDetailsWidget
