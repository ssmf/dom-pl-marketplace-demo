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
  floors: number
  buildingWidth: number | null
  buildingLength: number | null
  buildingFootprint: number | null
  totalArea: number | null
  roofType: string | null
  roofAngle: number | null
  garage: string | null
  architecturalStyle: string | null
  energyStandard: string | null
  basement: string | null
  buildingHeight: number | null
  fireplace: boolean | null
  terrace: boolean | null
  houseType: string | null
  vendor?: HousePlanVendor | null
  variantId?: string | null
}
