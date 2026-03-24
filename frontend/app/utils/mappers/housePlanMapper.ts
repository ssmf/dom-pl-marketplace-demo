import type { AppHousePlan } from '~/types/house-plan'

export function mapToAppHousePlan(raw: any): AppHousePlan {
  return {
    id: raw.id || '',
    title: raw.title || '',
    price: Number(raw.price) || 0,
    description: raw.description ?? null,
    houseArea: Number(raw.house_area) || 0,
    boilerRoomArea: raw.boiler_room_area ? Number(raw.boiler_room_area) : null,
    rooms: Number(raw.rooms) || 0,
    bathroomsAndWc: Number(raw.bathrooms_and_wc) || 0,
    plotDimensions: raw.plot_dimensions || '',
    minPlotDimensionsAfterAdaptation: raw.min_plot_dimensions_after_adaptation ?? null
  }
}
