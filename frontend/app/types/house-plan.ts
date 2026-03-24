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
}
