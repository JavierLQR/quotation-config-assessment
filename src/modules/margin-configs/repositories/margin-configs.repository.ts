import type { MarginConfig } from '../entities'
import type { UpsertMarginData, UpsertMarginEntryData } from '../types'

export abstract class MarginConfigsRepository {
  abstract findById(id: number): Promise<MarginConfig | null>

  abstract findByPlantId(
    plantId: number,
    page: number,
    perPage: number,
  ): Promise<{ items: MarginConfig[]; totalCount: number }>

  abstract findByPlantAndClientType(
    plantId: number,
    clientTypeId: number,
  ): Promise<MarginConfig[]>

  abstract findByPlantAndClient(
    plantId: number,
    clientId: number,
  ): Promise<MarginConfig[]>

  abstract upsert(data: UpsertMarginData): Promise<MarginConfig>

  abstract upsertMany(
    plantId: number,
    entries: UpsertMarginEntryData[],
  ): Promise<number>

  abstract delete(id: number): Promise<MarginConfig>
}
