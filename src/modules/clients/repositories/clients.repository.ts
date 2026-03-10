import type { Client } from '../entities'
import type { CreateClientData, UpdateClientData } from '../types'

export abstract class ClientsRepository {
  abstract findAll(
    page: number,
    perPage: number,
  ): Promise<{ items: Client[]; totalCount: number }>

  abstract findById(id: number): Promise<Client | null>

  abstract findByClientTypeId(clientTypeId: number): Promise<Client[]>

  abstract create(data: CreateClientData): Promise<Client>

  abstract update(id: number, data: UpdateClientData): Promise<Client>

  abstract delete(id: number): Promise<Client>
}
