export type AppOrderItem = {
  id: string
  title: string
  quantity: number
  unit_price: number
}

export type AppOrder = {
  id: string
  status: string
  created_at: string
  total: number
  email: string
  items: AppOrderItem[]
}
