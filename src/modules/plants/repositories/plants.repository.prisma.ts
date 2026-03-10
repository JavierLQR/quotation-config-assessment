import { Injectable } from '@nestjs/common'

import { PrismaService } from '@app/prisma'
import type { Plant } from '../entities'
import { PlantsRepository } from './plants.repository'

@Injectable()
export class PlantsRepositoryPrisma implements PlantsRepository {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * @description Find all plants.
   * @param page - The page number.
   * @param perPage - The number of items per page.
   * @returns The plants paginated.
   */
  public async findAll(
    page: number,
    perPage: number,
  ): Promise<{
    items: Plant[]
    totalCount: number
  }> {
    const skip = (page - 1) * perPage

    const [items, totalCount] = await Promise.all([
      this.prisma.plant.findMany({
        orderBy: { name: 'asc' },
        skip,
        take: perPage,
      }),
      this.prisma.plant.count(),
    ])

    return { items, totalCount }
  }

  /**
   * @description Find a plant by id.
   * @param id - The id of the plant.
   * @returns The plant.
   */
  public async findById(id: number): Promise<Plant | null> {
    return await this.prisma.plant.findUnique({ where: { id } })
  }

  /**
   * @description Find a plant by name.
   * @param name - The name of the plant.
   * @returns The plant.
   */
  public async findByName(name: string): Promise<Plant | null> {
    return await this.prisma.plant.findUnique({ where: { name } })
  }

  /**
   * @description Create a plant.
   * @param data - The data of the plant.
   * @returns The created plant.
   */
  public async create(data: { name: string }): Promise<Plant> {
    return await this.prisma.plant.create({ data })
  }

  /**
   * @description Update a plant.
   * @param id - The id of the plant.
   * @param data - The data of the plant.
   * @returns The updated plant.
   */
  public async update(id: number, data: { name?: string }): Promise<Plant> {
    return await this.prisma.plant.update({ where: { id }, data })
  }

  /**
   * @description Delete a plant.
   * @param id - The id of the plant.
   * @returns The deleted plant.
   */
  public async delete(id: number): Promise<Plant> {
    return await this.prisma.plant.delete({ where: { id } })
  }
}
