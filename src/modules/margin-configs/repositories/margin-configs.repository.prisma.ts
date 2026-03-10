import { Injectable } from '@nestjs/common'

import { PrismaService } from '@app/prisma/prisma.service'
import type { MarginConfig } from '../entities'
import type { UpsertMarginData, UpsertMarginEntryData } from '../types'
import { MarginConfigsRepository } from './margin-configs.repository'

@Injectable()
export class MarginConfigsRepositoryPrisma implements MarginConfigsRepository {
  constructor(private readonly prisma: PrismaService) {}

  public async findById(id: number): Promise<MarginConfig | null> {
    return await this.prisma.marginConfig.findUnique({ where: { id } })
  }

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

  public async findByPlantAndClientType(
    plantId: number,
    clientTypeId: number,
  ): Promise<MarginConfig[]> {
    return await this.prisma.marginConfig.findMany({
      where: { plantId, clientTypeId },
      orderBy: { volumeRange: 'asc' },
    })
  }

  public async findByPlantAndClient(
    plantId: number,
    clientId: number,
  ): Promise<MarginConfig[]> {
    return await this.prisma.marginConfig.findMany({
      where: { plantId, clientId },
      orderBy: { volumeRange: 'asc' },
    })
  }

  public async upsert(data: UpsertMarginData): Promise<MarginConfig> {
    const { plantId, clientTypeId, clientId, volumeRange, margin } = data
    return await this.prisma.marginConfig.upsert({
      where: {
        plantId_clientTypeId_clientId_volumeRange: {
          plantId,
          clientTypeId: clientTypeId ?? 0,
          clientId: clientId ?? 0,
          volumeRange,
        },
      },
      update: { margin },
      create: {
        plant: { connect: { id: plantId } },
        clientType: clientTypeId
          ? { connect: { id: clientTypeId } }
          : undefined,
        client: clientId ? { connect: { id: clientId } } : undefined,
        volumeRange,
        margin,
      },
    })
  }

  public async upsertMany(
    plantId: number,
    entries: UpsertMarginEntryData[],
  ): Promise<number> {
    const results = await Promise.all(
      entries.map((entry) => this.upsert({ ...entry, plantId })),
    )
    return results.length
  }

  public async delete(id: number): Promise<MarginConfig> {
    return await this.prisma.marginConfig.delete({ where: { id } })
  }
}
