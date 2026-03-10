export interface CreateClientData {
  name: string
  clientTypeId: number
  basePrice?: number
  pricingStrategy?: string
}

export interface UpdateClientData {
  name?: string
  basePrice?: number
  pricingStrategy?: string
}
