import { Inject, Injectable, Logger, NotFoundException } from '@nestjs/common'

import { PayloadBuilder } from '@common/responses'
import { buildPaginationMeta } from '@common/utils'
import type { PaginationArgs } from '@common/pagination'

import type { UpsertMarginInput, SavePlantConfigInput } from './dto'
import {
  MARGIN_CONFIGS_REPOSITORY,
  MarginConfigsRepository,
} from './repositories'

@Injectable()
export class MarginConfigsService {
  private readonly logger = new Logger(MarginConfigsService.name)

  constructor(
    @Inject(MARGIN_CONFIGS_REPOSITORY)
    private readonly marginConfigsRepository: MarginConfigsRepository,
  ) {}

  public async findByPlantId(plantId: number, pagination: PaginationArgs) {
    const { page, perPage } = pagination
    this.logger.debug('Finding margin configs by plantId', {
      plantId,
      page,
      perPage,
    })

    const { items, totalCount } =
      await this.marginConfigsRepository.findByPlantId(plantId, page, perPage)

    const metadataPagination = buildPaginationMeta({
      totalCount,
      currentPage: page,
      perPage,
    })

    return PayloadBuilder.success(
      'Margin configs retrieved successfully',
      items,
      metadataPagination,
    )
  }

  public async findByPlantAndClientType(plantId: number, clientTypeId: number) {
    this.logger.debug('Finding margin configs by plant and clientType', {
      plantId,
      clientTypeId,
    })
    const items = await this.marginConfigsRepository.findByPlantAndClientType(
      plantId,
      clientTypeId,
    )
    return PayloadBuilder.success(
      'Margin configs retrieved successfully',
      items,
    )
  }

  public async findByPlantAndClient(plantId: number, clientId: number) {
    this.logger.debug('Finding margin configs by plant and client', {
      plantId,
      clientId,
    })
    const items = await this.marginConfigsRepository.findByPlantAndClient(
      plantId,
      clientId,
    )
    return PayloadBuilder.success(
      'Margin configs retrieved successfully',
      items,
    )
  }

  public async upsert(input: UpsertMarginInput) {
    this.logger.debug('Upserting margin config', { plantId: input.plantId })
    const marginConfig = await this.marginConfigsRepository.upsert(input)
    return PayloadBuilder.success(
      'Margin config saved successfully',
      marginConfig,
    )
  }

  public async savePlantConfig(input: SavePlantConfigInput) {
    this.logger.debug('Saving plant config', {
      plantId: input.plantId,
      entries: input.margins.length,
    })
    const count = await this.marginConfigsRepository.upsertMany(
      input.plantId,
      input.margins,
    )
    return PayloadBuilder.success('Plant config saved successfully', count)
  }

  public async remove(id: number) {
    this.logger.debug('Removing margin config', { id })

    const existing = await this.marginConfigsRepository.findById(id)
    if (!existing)
      throw new NotFoundException(`MarginConfig with id ${id} not found`)

    const marginConfig = await this.marginConfigsRepository.delete(id)
    return PayloadBuilder.success(
      'Margin config deleted successfully',
      marginConfig,
    )
  }
}
