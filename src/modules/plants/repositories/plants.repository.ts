import type { Plant } from '../entities'

export const PLANTS_REPOSITORY = Symbol('PLANTS_REPOSITORY')

export abstract class PlantsRepository {
  abstract findAll(
    page: number,
    perPage: number,
  ): Promise<{
    items: Plant[]
    totalCount: number
  }>
  abstract findById(id: number): Promise<Plant | null>
  abstract findByName(name: string): Promise<Plant | null>
  abstract create(data: { name: string }): Promise<Plant>
  abstract update(id: number, data: { name: string }): Promise<Plant>
  abstract delete(id: number): Promise<Plant>
}
