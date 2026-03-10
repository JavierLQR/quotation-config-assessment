export interface CreateClientData {
  name: string
  clientTypeId?: number | null
  basePrice?: number
  pricingStrategy?: string
}

export interface UpdateClientData {
  name?: string
  clientTypeId?: number | null
  basePrice?: number
  pricingStrategy?: string
}
