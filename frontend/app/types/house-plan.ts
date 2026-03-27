export type HousePlanVendor = {
  id: string
  company_name: string
  first_name: string
  last_name: string
  email: string
  average_rating: number | null
  house_plans_count: number
}

export type HousePlanApiResponse = {
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
  vendor?: HousePlanVendor | null
  variant_id?: string | null
}

export interface AppHousePlan {
  id: string
  title: string
  price: number
  description: string | null
  img: string | null
  houseArea: number
  boilerRoomArea: number | null
  rooms: number
  bathroomsAndWc: number
  plotDimensions: string
  minPlotDimensionsAfterAdaptation: string | null
  vendor?: HousePlanVendor | null
  variantId?: string | null
}
