import { Injectable } from '@nestjs/common'

import { PrismaService } from '@app/prisma/prisma.service'
import type { ClientType } from '../entities'
import type {
  CreateClientTypeData,
  UpdateClientTypeData,
  ClientTypeWithClients,
} from '../types'
import { ClientTypesRepository } from './client-types.repository'

@Injectable()
export class ClientTypesRepositoryPrisma implements ClientTypesRepository {
  constructor(private readonly prisma: PrismaService) {}

  public async findAll(
    page: number,
    perPage: number,
  ): Promise<{ items: ClientType[]; totalCount: number }> {
    const skip = (page - 1) * perPage

    const [items, totalCount] = await Promise.all([
      this.prisma.clientType.findMany({
        orderBy: { name: 'asc' },
        skip,
        take: perPage,
      }),
      this.prisma.clientType.count(),
    ])

    return { items, totalCount }
  }

  public async findById(id: number): Promise<ClientType | null> {
    return await this.prisma.clientType.findUnique({ where: { id } })
  }

  public async findByName(name: string): Promise<ClientType | null> {
    return await this.prisma.clientType.findUnique({ where: { name } })
  }

  public async findByIdWithClients(
    id: number,
  ): Promise<ClientTypeWithClients | null> {
    return await this.prisma.clientType.findUnique({
      where: { id },
      include: { clients: { select: { id: true, name: true } } },
    })
  }

  public async create(data: CreateClientTypeData): Promise<ClientType> {
    return await this.prisma.clientType.create({ data })
  }

  public async update(
    id: number,
    data: UpdateClientTypeData,
  ): Promise<ClientType> {
    return await this.prisma.clientType.update({ where: { id }, data })
  }

  public async delete(id: number): Promise<ClientType> {
    return await this.prisma.clientType.delete({ where: { id } })
  }
}
