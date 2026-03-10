import { Injectable } from '@nestjs/common'

import { PrismaService } from '@app/prisma/prisma.service'

import type { Client } from '../entities'
import type { CreateClientData, UpdateClientData } from '../types'
import { ClientsRepository } from './clients.repository'

@Injectable()
export class ClientsRepositoryPrisma implements ClientsRepository {
  constructor(private readonly prisma: PrismaService) {}

  public async findAll(
    page: number,
    perPage: number,
  ): Promise<{ items: Client[]; totalCount: number }> {
    const skip = (page - 1) * perPage

    const [items, totalCount] = await Promise.all([
      this.prisma.client.findMany({
        orderBy: { name: 'asc' },
        skip,
        take: perPage,
      }),
      this.prisma.client.count(),
    ])

    return { items, totalCount }
  }

  public async findById(id: number): Promise<Client | null> {
    return await this.prisma.client.findUnique({ where: { id } })
  }

  public async findByClientTypeId(clientTypeId: number): Promise<Client[]> {
    return await this.prisma.client.findMany({
      where: { clientTypeId },
      orderBy: { name: 'asc' },
    })
  }

  public async create(data: CreateClientData): Promise<Client> {
    return await this.prisma.client.create({ data })
  }

  public async update(id: number, data: UpdateClientData): Promise<Client> {
    return await this.prisma.client.update({ where: { id }, data })
  }

  public async delete(id: number): Promise<Client> {
    return await this.prisma.client.delete({ where: { id } })
  }
}
