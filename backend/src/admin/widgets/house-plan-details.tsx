import { defineWidgetConfig } from "@medusajs/admin-sdk"
import {
  Button,
  Container,
  Drawer,
  Heading,
  Input,
  Label,
  Select,
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
  floors: number
  building_width: number | null
  building_length: number | null
  building_footprint: number | null
  total_area: number | null
  roof_type: string | null
  roof_angle: number | null
  garage: string | null
  architectural_style: string | null
  energy_standard: string | null
  basement: string | null
  building_height: number | null
  fireplace: boolean | null
  terrace: boolean | null
  house_type: string | null
  created_at: string
  updated_at: string
}

// Pomocniki konwersji dla planToForm
const ns = (v: number | null | undefined) => v != null ? String(v) : ""
const ss = (v: string | null | undefined) => v ?? ""
const boolToForm = (v: boolean | null) => v === true ? "tak" : v === false ? "nie" : ""

const planToForm = (plan: HousePlan) => ({
  title:                               plan.title,
  price:                               String(plan.price),
  description:                         ss(plan.description),
  img:                                 ss(plan.img),
  house_area:                          String(plan.house_area),
  boiler_room_area:                    ns(plan.boiler_room_area),
  rooms:                               String(plan.rooms),
  bathrooms_and_wc:                    String(plan.bathrooms_and_wc),
  plot_dimensions:                     plan.plot_dimensions,
  min_plot_dimensions_after_adaptation: ss(plan.min_plot_dimensions_after_adaptation),
  floors:                              ns(plan.floors),
  building_width:                      ns(plan.building_width),
  building_length:                     ns(plan.building_length),
  building_footprint:                  ns(plan.building_footprint),
  total_area:                          ns(plan.total_area),
  roof_type:                           ss(plan.roof_type),
  roof_angle:                          ns(plan.roof_angle),
  garage:                              ss(plan.garage),
  architectural_style:                 ss(plan.architectural_style),
  energy_standard:                     ss(plan.energy_standard),
  basement:                            ss(plan.basement),
  building_height:                     ns(plan.building_height),
  fireplace:                           boolToForm(plan.fireplace),
  terrace:                             boolToForm(plan.terrace),
  house_type:                          ss(plan.house_type),
})

type EditForm = ReturnType<typeof planToForm>

const numOrNull = (val: string) =>
  val && !isNaN(Number(val)) ? Number(val) : null

const formToBool = (val: string) =>
  val === "tak" ? true : val === "nie" ? false : null

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
      boiler_room_area: numOrNull(form.boiler_room_area),
      min_plot_dimensions_after_adaptation: form.min_plot_dimensions_after_adaptation.trim() || null,
      floors: numOrNull(form.floors),
      building_width: numOrNull(form.building_width),
      building_length: numOrNull(form.building_length),
      building_footprint: numOrNull(form.building_footprint),
      total_area: numOrNull(form.total_area),
      roof_type: form.roof_type || null,
      roof_angle: numOrNull(form.roof_angle),
      garage: form.garage || null,
      architectural_style: form.architectural_style || null,
      energy_standard: form.energy_standard || null,
      basement: form.basement || null,
      building_height: numOrNull(form.building_height),
      fireplace: formToBool(form.fireplace),
      terrace: formToBool(form.terrace),
      house_type: form.house_type || null,
    })
  }

  const set = (key: keyof EditForm, val: string) => {
    setForm((f) => f ? { ...f, [key]: val } : f)
    setErrors((e) => ({ ...e, [key]: undefined }))
  }

  // Pole tekstowe / numeryczne
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
          onChange={(e) => set(key, e.target.value)}
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

  // Pole Select z predefiniowanymi opcjami
  const selectField = (
    key: keyof EditForm,
    label: string,
    options: { label: string; value: string }[]
  ) => {
    if (!form) return null
    return (
      <div className="flex flex-col gap-y-1">
        <Label size="small" weight="plus">{label}</Label>
        <Select value={form[key]} onValueChange={(val) => set(key, val)}>
          <Select.Trigger>
            <Select.Value placeholder="Wybierz..." />
          </Select.Trigger>
          <Select.Content>
            {options.map((opt) => (
              <Select.Item key={opt.value} value={opt.value}>
                {opt.label}
              </Select.Item>
            ))}
          </Select.Content>
        </Select>
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
          <DetailRow label="Powierzchnia użytkowa" value={`${housePlan.house_area} m²`} />
          {housePlan.boiler_room_area != null && (
            <DetailRow label="Powierzchnia kotłowni" value={`${housePlan.boiler_room_area} m²`} />
          )}
          {housePlan.total_area != null && (
            <DetailRow label="Powierzchnia całkowita" value={`${housePlan.total_area} m²`} />
          )}
          {housePlan.building_footprint != null && (
            <DetailRow label="Powierzchnia zabudowy" value={`${housePlan.building_footprint} m²`} />
          )}
          <DetailRow label="Liczba pokoi" value={housePlan.rooms} />
          <DetailRow label="Łazienki i WC" value={housePlan.bathrooms_and_wc} />
          {housePlan.floors != null && (
            <DetailRow label="Kondygnacje" value={housePlan.floors} />
          )}
          <DetailRow label="Wymiary działki" value={`${housePlan.plot_dimensions} m`} />
          {housePlan.min_plot_dimensions_after_adaptation && (
            <DetailRow label="Min. wymiary po adaptacji" value={housePlan.min_plot_dimensions_after_adaptation} />
          )}
          {(housePlan.building_width != null && housePlan.building_length != null) && (
            <DetailRow label="Wymiary budynku" value={`${housePlan.building_width} × ${housePlan.building_length} m`} />
          )}
          {housePlan.building_height != null && (
            <DetailRow label="Wysokość budynku" value={`${housePlan.building_height} m`} />
          )}
          {housePlan.roof_type && (
            <DetailRow
              label="Dach"
              value={housePlan.roof_angle ? `${housePlan.roof_type}, ${housePlan.roof_angle}°` : housePlan.roof_type}
            />
          )}
          {housePlan.house_type && (
            <DetailRow label="Typ domu" value={housePlan.house_type} />
          )}
          {housePlan.garage && (
            <DetailRow label="Garaż" value={housePlan.garage} />
          )}
          {housePlan.basement && (
            <DetailRow label="Piwnica" value={housePlan.basement} />
          )}
          {housePlan.architectural_style && (
            <DetailRow label="Styl architektoniczny" value={housePlan.architectural_style} />
          )}
          {housePlan.energy_standard && (
            <DetailRow label="Standard energetyczny" value={housePlan.energy_standard} />
          )}
          {housePlan.fireplace != null && (
            <DetailRow label="Kominek" value={housePlan.fireplace ? "Tak" : "Nie"} />
          )}
          {housePlan.terrace != null && (
            <DetailRow label="Taras" value={housePlan.terrace ? "Tak" : "Nie"} />
          )}
          {housePlan.description && (
            <div className="py-3">
              <Text size="small" leading="compact" className="text-ui-fg-subtle mb-1">Opis</Text>
              <Text size="small" leading="compact">{housePlan.description}</Text>
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

            {/* Podstawowe informacje */}
            <div className="flex flex-col gap-y-4">
              <Heading level="h3">Podstawowe informacje</Heading>
              {field("title", "Tytuł", { required: true })}
              {field("price", "Cena (PLN)", { type: "number", required: true })}
              <div className="flex flex-col gap-y-1">
                <Label size="small" weight="plus">Opis</Label>
                {form && (
                  <Textarea
                    value={form.description}
                    onChange={(e) => set("description", e.target.value)}
                    placeholder="Opis planu domu..."
                    rows={4}
                  />
                )}
              </div>
              {field("img", "URL zdjęcia")}
            </div>

            {/* Parametry techniczne */}
            <div className="flex flex-col gap-y-4">
              <Heading level="h3">Parametry techniczne</Heading>
              {field("house_area", "Powierzchnia użytkowa (m²)", { type: "number", required: true })}
              {field("boiler_room_area", "Powierzchnia kotłowni (m²)", { type: "number" })}
              {field("total_area", "Powierzchnia całkowita (m²)", { type: "number" })}
              {field("building_footprint", "Powierzchnia zabudowy (m²)", { type: "number" })}
              {field("rooms", "Liczba pokoi", { type: "number", required: true })}
              {field("bathrooms_and_wc", "Łazienki i WC", { type: "number", required: true })}
              {field("floors", "Liczba kondygnacji", { type: "number" })}
              {field("plot_dimensions", "Wymiary działki (np. 15x20)", { required: true })}
              {field("min_plot_dimensions_after_adaptation", "Min. wymiary działki po adaptacji")}
            </div>

            {/* Bryła budynku */}
            <div className="flex flex-col gap-y-4">
              <Heading level="h3">Bryła budynku</Heading>
              {field("building_width", "Szerokość budynku (m)", { type: "number" })}
              {field("building_length", "Długość budynku (m)", { type: "number" })}
              {field("building_height", "Wysokość budynku (m)", { type: "number" })}
              {selectField("roof_type", "Rodzaj dachu", [
                { label: "Dwuspadowy", value: "dwuspadowy" },
                { label: "Czterospadowy", value: "czterospadowy" },
                { label: "Płaski", value: "płaski" },
                { label: "Mansardowy", value: "mansardowy" },
                { label: "Jednospadowy", value: "jednospadowy" },
              ])}
              {field("roof_angle", "Kąt nachylenia dachu (°)", { type: "number" })}
            </div>

            {/* Wyposażenie */}
            <div className="flex flex-col gap-y-4">
              <Heading level="h3">Wyposażenie</Heading>
              {selectField("garage", "Garaż", [
                { label: "Brak", value: "brak" },
                { label: "Jednostanowiskowy", value: "jednostanowiskowy" },
                { label: "Dwustanowiskowy", value: "dwustanowiskowy" },
                { label: "Trzystanowiskowy", value: "trzystanowiskowy" },
              ])}
              {selectField("basement", "Piwnica", [
                { label: "Brak", value: "brak" },
                { label: "Częściowa", value: "częściowa" },
                { label: "Pełna", value: "pełna" },
              ])}
              {selectField("fireplace", "Kominek", [
                { label: "Tak", value: "tak" },
                { label: "Nie", value: "nie" },
              ])}
              {selectField("terrace", "Taras", [
                { label: "Tak", value: "tak" },
                { label: "Nie", value: "nie" },
              ])}
            </div>

            {/* Styl i standard */}
            <div className="flex flex-col gap-y-4">
              <Heading level="h3">Styl i standard</Heading>
              {selectField("house_type", "Typ domu", [
                { label: "Jednorodzinny", value: "jednorodzinny" },
                { label: "Bliźniak", value: "bliźniak" },
                { label: "Rekreacyjny", value: "rekreacyjny" },
              ])}
              {selectField("architectural_style", "Styl architektoniczny", [
                { label: "Tradycyjny", value: "tradycyjny" },
                { label: "Nowoczesny", value: "nowoczesny" },
                { label: "Klasyczny", value: "klasyczny" },
                { label: "Skandynawski", value: "skandynawski" },
              ])}
              {selectField("energy_standard", "Standard energetyczny", [
                { label: "Standard", value: "standard" },
                { label: "Energooszczędny", value: "energooszczędny" },
                { label: "Pasywny", value: "pasywny" },
              ])}
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
