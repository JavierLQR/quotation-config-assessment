import { Args, Int, Mutation, Query, Resolver } from '@nestjs/graphql'

import { PaginationArgs } from '@common/pagination'

import { MarginConfigsService } from './margin-configs.service'
import { SavePlantConfigInput, UpsertMarginInput } from './dto'
import { MarginConfig } from './entities'
import {
  MarginConfigResponse,
  MarginConfigsListResponse,
  PaginatedMarginConfigsResponse,
  SavePlantConfigResponse,
} from './types'

@Resolver(() => MarginConfig)
export class MarginConfigsResolver {
  constructor(private readonly marginConfigsService: MarginConfigsService) {}

  @Query(() => PaginatedMarginConfigsResponse, {
    name: 'marginsByPlant',
    description: 'Get paginated margin configs for a plant',
  })
  findByPlant(
    @Args('plantId', { type: () => Int }) plantId: number,
    @Args('pagination', { defaultValue: {} }) pagination: PaginationArgs,
  ) {
    return this.marginConfigsService.findByPlantId(plantId, pagination)
  }

  @Query(() => MarginConfigsListResponse, {
    name: 'marginsByPlantAndClientType',
    description: 'Get margin configs for a plant filtered by client type',
  })
  findByPlantAndClientType(
    @Args('plantId', { type: () => Int }) plantId: number,
    @Args('clientTypeId', { type: () => Int }) clientTypeId: number,
  ) {
    return this.marginConfigsService.findByPlantAndClientType(
      plantId,
      clientTypeId,
    )
  }

  @Query(() => MarginConfigsListResponse, {
    name: 'marginsByPlantAndClient',
    description: 'Get margin configs for a plant filtered by client',
  })
  findByPlantAndClient(
    @Args('plantId', { type: () => Int }) plantId: number,
    @Args('clientId', { type: () => Int }) clientId: number,
  ) {
    return this.marginConfigsService.findByPlantAndClient(plantId, clientId)
  }

  @Mutation(() => MarginConfigResponse)
  upsertMargin(@Args('input') input: UpsertMarginInput) {
    return this.marginConfigsService.upsert(input)
  }

  @Mutation(() => SavePlantConfigResponse, {
    description: 'Save all margin entries for a plant at once',
  })
  savePlantConfig(@Args('input') input: SavePlantConfigInput) {
    return this.marginConfigsService.savePlantConfig(input)
  }

  @Mutation(() => MarginConfigResponse)
  removeMargin(@Args('id', { type: () => Int }) id: number) {
    return this.marginConfigsService.remove(id)
  }
}
