import type { ClientType } from '../entities'
import type {
  CreateClientTypeData,
  UpdateClientTypeData,
  ClientTypeWithClients,
} from '../types'

export abstract class ClientTypesRepository {
  abstract findAll(
    page: number,
    perPage: number,
  ): Promise<{ items: ClientType[]; totalCount: number }>

  abstract findById(id: number): Promise<ClientType | null>

  abstract findByName(name: string): Promise<ClientType | null>

  abstract findByIdWithClients(
    id: number,
  ): Promise<ClientTypeWithClients | null>

  abstract create(data: CreateClientTypeData): Promise<ClientType>

  abstract update(id: number, data: UpdateClientTypeData): Promise<ClientType>

  abstract delete(id: number): Promise<ClientType>
}
