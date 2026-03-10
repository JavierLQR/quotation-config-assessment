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

import type { CreatePlantInput, UpdatePlantInput } from './dto'
import { PLANTS_REPOSITORY, PlantsRepository } from './repositories'

@Injectable()
export class PlantsService {
  private readonly logger = new Logger(PlantsService.name)

  constructor(
    @Inject(PLANTS_REPOSITORY)
    private readonly plantsRepository: PlantsRepository,
  ) {}

  /**
   * @description Find all plants.
   * @param pagination - The pagination arguments.
   * @returns The plants paginated.
   */
  public async findAll(pagination: PaginationArgs) {
    const { page, perPage } = pagination
    this.logger.debug('Finding all plants', { page, perPage })

    const { items, totalCount } = await this.plantsRepository.findAll(
      page,
      perPage,
    )
    const metadataPagination = buildPaginationMeta({
      totalCount,
      currentPage: page,
      perPage,
    })

    return PayloadBuilder.success(
      'Plants retrieved successfully',
      items,
      metadataPagination,
    )
  }

  /**
   * @description Find a plant by id.
   * @param id - The id of the plant.
   * @returns The plant.
   */
  public async findById(id: number) {
    this.logger.debug('Finding plant by id', { id })
    const plant = await this.plantsRepository.findById(id)
    if (!plant) throw new NotFoundException(`Plant with id ${id} not found`)
    return PayloadBuilder.success('Plant retrieved successfully', plant)
  }

  /**
   * @description Create a plant.
   * @param input - The input to create the plant.
   * @returns The created plant.
   */
  public async create(input: CreatePlantInput) {
    const { name } = input
    this.logger.debug('Creating plant', { name })

    const existing = await this.plantsRepository.findByName(name)
    if (existing)
      throw new BadRequestException(`Plant with name "${name}" already exists`)

    const plant = await this.plantsRepository.create({ name })
    return PayloadBuilder.success('Plant created successfully', plant)
  }

  /**
   * @description Update a plant.
   * @param input - The input to update the plant.
   * @returns The updated plant.
   */
  public async update(input: UpdatePlantInput) {
    const { id, name } = input
    this.logger.debug('Updating plant', { id, name })

    const existing = await this.plantsRepository.findById(id)
    if (!existing) throw new NotFoundException(`Plant with id ${id} not found`)

    const plant = await this.plantsRepository.update(id, { name })
    return PayloadBuilder.success('Plant updated successfully', plant)
  }

  /**
   * @description Remove a plant.
   * @param id - The id of the plant.
   * @returns The removed plant.
   */
  public async remove(id: number) {
    this.logger.debug('Removing plant', { id })

    const existing = await this.plantsRepository.findById(id)
    if (!existing) throw new NotFoundException(`Plant with id ${id} not found`)

    const plant = await this.plantsRepository.delete(id)
    return PayloadBuilder.success('Plant deleted successfully', plant)
  }
}
