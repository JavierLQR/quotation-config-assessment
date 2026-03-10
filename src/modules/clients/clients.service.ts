import { Inject, Injectable, Logger, NotFoundException } from '@nestjs/common'

import { PayloadBuilder } from '@common/responses'
import { buildPaginationMeta } from '@common/utils'
import type { PaginationArgs } from '@common/pagination'

import type { CreateClientInput, UpdateClientInput } from './dto'
import { CLIENTS_REPOSITORY, ClientsRepository } from './repositories'

@Injectable()
export class ClientsService {
  private readonly logger = new Logger(ClientsService.name)

  constructor(
    @Inject(CLIENTS_REPOSITORY)
    private readonly clientsRepository: ClientsRepository,
  ) {}

  public async findAll(pagination: PaginationArgs) {
    const { page, perPage } = pagination
    this.logger.debug('Finding all clients', { page, perPage })

    const { items, totalCount } = await this.clientsRepository.findAll(
      page,
      perPage,
    )
    const metadataPagination = buildPaginationMeta({
      totalCount,
      currentPage: page,
      perPage,
    })

    return PayloadBuilder.success(
      'Clients retrieved successfully',
      items,
      metadataPagination,
    )
  }

  public async findById(id: number) {
    this.logger.debug('Finding client by id', { id })
    const client = await this.clientsRepository.findById(id)
    if (!client) throw new NotFoundException(`Client with id ${id} not found`)
    return PayloadBuilder.success('Client retrieved successfully', client)
  }

  public async findByClientTypeId(clientTypeId: number) {
    this.logger.debug('Finding clients by clientTypeId', { clientTypeId })
    const clients =
      await this.clientsRepository.findByClientTypeId(clientTypeId)
    return PayloadBuilder.success('Clients retrieved successfully', clients)
  }

  public async create(input: CreateClientInput) {
    const { name, clientTypeId, basePrice, pricingStrategy } = input
    this.logger.debug('Creating client', { name, clientTypeId })

    const client = await this.clientsRepository.create({
      name,
      clientTypeId,
      basePrice,
      pricingStrategy,
    })
    return PayloadBuilder.success('Client created successfully', client)
  }

  public async update(input: UpdateClientInput) {
    const { id, name, basePrice, pricingStrategy } = input
    this.logger.debug('Updating client', { id })

    const existing = await this.clientsRepository.findById(id)
    if (!existing) throw new NotFoundException(`Client with id ${id} not found`)

    const client = await this.clientsRepository.update(id, {
      name,
      basePrice,
      pricingStrategy,
    })
    return PayloadBuilder.success('Client updated successfully', client)
  }

  public async remove(id: number) {
    this.logger.debug('Removing client', { id })

    const existing = await this.clientsRepository.findById(id)
    if (!existing) throw new NotFoundException(`Client with id ${id} not found`)

    const client = await this.clientsRepository.delete(id)
    return PayloadBuilder.success('Client deleted successfully', client)
  }
}
