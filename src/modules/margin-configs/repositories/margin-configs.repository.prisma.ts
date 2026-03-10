import { Injectable } from '@nestjs/common'

import { PrismaService } from '@app/prisma/prisma.service'
import type { MarginConfig } from '../entities'
import type { UpsertMarginData, UpsertMarginEntryData } from '../types'
import { MarginConfigsRepository } from './margin-configs.repository'

@Injectable()
export class MarginConfigsRepositoryPrisma implements MarginConfigsRepository {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * @description Find a margin config by id.
   * @param id - The id of the margin config.
   * @returns The margin config.
   */
  public async findById(id: number): Promise<MarginConfig | null> {
    return await this.prisma.marginConfig.findUnique({ where: { id } })
  }

  /**
   * @description Find margin configs by plant id.
   * @param plantId - The id of the plant.
   * @param page - The page number.
   * @param perPage - The number of items per page.
   * @returns The margin configs.
   */
  public async findByPlantId(
    plantId: number,
    page: number,
    perPage: number,
  ): Promise<{ items: MarginConfig[]; totalCount: number }> {
    const skip = (page - 1) * perPage

    const [items, totalCount] = await Promise.all([
      this.prisma.marginConfig.findMany({
        where: { plantId },
        orderBy: { volumeRange: 'asc' },
        skip,
        take: perPage,
      }),
      this.prisma.marginConfig.count({ where: { plantId } }),
    ])

    return { items, totalCount }
  }

  /**
   * @description Find margin configs by plant and client type.
   * @param plantId - The id of the plant.
   * @param clientTypeId - The id of the client type.
   * @returns The margin configs.
   */
  public async findByPlantAndClientType(
    plantId: number,
    clientTypeId: number,
  ): Promise<MarginConfig[]> {
    return await this.prisma.marginConfig.findMany({
      where: { plantId, clientTypeId },
      orderBy: { volumeRange: 'asc' },
    })
  }

  /**
   * @description Find margin configs by plant and client.
   * @param plantId - The id of the plant.
   * @param clientId - The id of the client.
   * @returns The margin configs.
   */
  public async findByPlantAndClient(
    plantId: number,
    clientId: number,
  ): Promise<MarginConfig[]> {
    return await this.prisma.marginConfig.findMany({
      where: { plantId, clientId },
      orderBy: { volumeRange: 'asc' },
    })
  }

  /**
   * @description Upsert a margin config.
   * @param data - The data to upsert the margin config.
   * @returns The upserted margin config.
   */
  public async upsert(data: UpsertMarginData): Promise<MarginConfig> {
    const { plantId, clientTypeId, clientId, volumeRange, margin } = data

    return await this.prisma.$transaction(async (tx) => {
      await tx.marginConfig.deleteMany({
        where: {
          plantId,
          clientTypeId: clientTypeId ?? null,
          clientId: clientId ?? null,
          volumeRange,
        },
      })
      return await tx.marginConfig.create({
        data: {
          plant: { connect: { id: plantId } },
          clientType: clientTypeId
            ? { connect: { id: clientTypeId } }
            : undefined,
          client: clientId ? { connect: { id: clientId } } : undefined,
          volumeRange,
          margin,
        },
      })
    })
  }

  /**
   * @description Upsert multiple margin configs.
   * @param plantId - The id of the plant.
   * @param entries - The entries to upsert.
   * @returns The number of upserted margin configs.
   */
  public async upsertMany(
    plantId: number,
    entries: UpsertMarginEntryData[],
  ): Promise<number> {
    const results = await Promise.all(
      entries.map((entry) => this.upsert({ ...entry, plantId })),
    )
    return results.length
  }

  /**
   * @description Delete a margin config.
   * @param id - The id of the margin config.
   * @returns The deleted margin config.
   */
  public async delete(id: number): Promise<MarginConfig> {
    return await this.prisma.marginConfig.delete({ where: { id } })
  }
}
