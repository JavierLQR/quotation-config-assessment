import {
  BadRequestException,
  Inject,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common'

import { PayloadBuilder } from '@common/responses'
import { buildPaginationMeta } from '@common/utils'
import type { PaginationArgs } from '@common/pagination'

import type { CreateClientTypeInput, UpdateClientTypeInput } from './dto'
import { CLIENT_TYPES_REPOSITORY, ClientTypesRepository } from './repositories'

@Injectable()
export class ClientTypesService {
  private readonly logger = new Logger(ClientTypesService.name)

  constructor(
    @Inject(CLIENT_TYPES_REPOSITORY)
    private readonly clientTypesRepository: ClientTypesRepository,
  ) {}

  public async findAll(pagination: PaginationArgs) {
    const { page, perPage } = pagination
    this.logger.debug('Finding all client types', { page, perPage })

    const { items, totalCount } = await this.clientTypesRepository.findAll(
      page,
      perPage,
    )
    const metadataPagination = buildPaginationMeta({
      totalCount,
      currentPage: page,
      perPage,
    })

    return PayloadBuilder.success(
      'Client types retrieved successfully',
      items,
      metadataPagination,
    )
  }

  public async findById(id: number) {
    this.logger.debug('Finding client type by id', { id })
    const clientType = await this.clientTypesRepository.findById(id)
    if (!clientType)
      throw new NotFoundException(`ClientType with id ${id} not found`)
    return PayloadBuilder.success(
      'Client type retrieved successfully',
      clientType,
    )
  }

  public async create(input: CreateClientTypeInput) {
    const { name, basePrice, pricingStrategy } = input
    this.logger.debug('Creating client type', { name })

    const existing = await this.clientTypesRepository.findByName(name)
    if (existing)
      throw new BadRequestException(
        `ClientType with name "${name}" already exists`,
      )

    const clientType = await this.clientTypesRepository.create({
      name,
      basePrice,
      pricingStrategy,
    })
    return PayloadBuilder.success(
      'Client type created successfully',
      clientType,
    )
  }

  public async update(input: UpdateClientTypeInput) {
    const { id, name, basePrice, pricingStrategy } = input
    this.logger.debug('Updating client type', { id })

    const existing = await this.clientTypesRepository.findById(id)
    if (!existing)
      throw new NotFoundException(`ClientType with id ${id} not found`)

    const clientType = await this.clientTypesRepository.update(id, {
      name,
      basePrice,
      pricingStrategy,
    })
    return PayloadBuilder.success(
      'Client type updated successfully',
      clientType,
    )
  }

  public async remove(id: number) {
    this.logger.debug('Removing client type', { id })

    const existing = await this.clientTypesRepository.findById(id)
    if (!existing)
      throw new NotFoundException(`ClientType with id ${id} not found`)

    const clientType = await this.clientTypesRepository.delete(id)
    return PayloadBuilder.success(
      'Client type deleted successfully',
      clientType,
    )
  }
}
