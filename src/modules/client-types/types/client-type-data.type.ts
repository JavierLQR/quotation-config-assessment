export interface CreateClientTypeData {
  name: string
  basePrice: number
  pricingStrategy?: string
}

export interface UpdateClientTypeData {
  name?: string
  basePrice?: number
  pricingStrategy?: string
}

export interface ClientTypeWithClients {
  id: number
  name: string
  basePrice: number
  pricingStrategy: string
  clients: { id: number; name: string }[]
}
