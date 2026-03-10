import { Injectable } from '@nestjs/common'

import { PrismaService } from '@app/prisma'
import type { Plant } from '../entities'
import { PlantsRepository } from './plants.repository'

@Injectable()
export class PlantsRepositoryPrisma implements PlantsRepository {
  constructor(private readonly prisma: PrismaService) {}

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

  public async findById(id: number): Promise<Plant | null> {
    return await this.prisma.plant.findUnique({ where: { id } })
  }

  public async findByName(name: string): Promise<Plant | null> {
    return await this.prisma.plant.findUnique({ where: { name } })
  }

  public async create(data: { name: string }): Promise<Plant> {
    return await this.prisma.plant.create({ data })
  }

  public async update(id: number, data: { name?: string }): Promise<Plant> {
    return await this.prisma.plant.update({ where: { id }, data })
  }

  public async delete(id: number): Promise<Plant> {
    return await this.prisma.plant.delete({ where: { id } })
  }
}
