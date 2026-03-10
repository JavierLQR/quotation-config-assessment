import type { Plant } from '../entities'

export const PLANTS_REPOSITORY = Symbol('PLANTS_REPOSITORY')

export abstract class PlantsRepository {
  /**
   * @description Find all plants.
   * @param page - The page number.
   * @param perPage - The number of items per page.
   * @returns The plants paginated.
   */
  abstract findAll(
    page: number,
    perPage: number,
  ): Promise<{
    items: Plant[]
    totalCount: number
  }>

  /**
   * @description Find a plant by id.
   * @param id - The id of the plant.
   * @returns The plant.
   */
  abstract findById(id: number): Promise<Plant | null>

  /**
   * @description Find a plant by name.
   * @param name - The name of the plant.
   * @returns The plant.
   */
  abstract findByName(name: string): Promise<Plant | null>

  /**
   * @description Create a plant.
   * @param data - The data of the plant.
   * @returns The created plant.
   */
  abstract create(data: { name: string }): Promise<Plant>

  /**
   * @description Update a plant.
   * @param id - The id of the plant.
   * @param data - The data of the plant.
   * @returns The updated plant.
   */
  abstract update(id: number, data: { name: string }): Promise<Plant>

  /**
   * @description Delete a plant.
   * @param id - The id of the plant.
   * @returns The deleted plant.
   */
  abstract delete(id: number): Promise<Plant>
}
