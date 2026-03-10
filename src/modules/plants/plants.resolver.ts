import { Args, Int, Mutation, Query, Resolver } from '@nestjs/graphql'

import { PaginationArgs } from '@common/pagination'

import { Plant } from './entities'
import { PlantsService } from './plants.service'
import { CreatePlantInput, UpdatePlantInput } from './dto'
import { PaginatedPlantsResponse, PlantResponse } from './types'

@Resolver(() => Plant)
export class PlantsResolver {
  constructor(private readonly plantsService: PlantsService) {}

  @Query(() => PaginatedPlantsResponse, {
    name: 'plants',
    description: 'Get paginated list of plants',
  })
  findAll(
    @Args('pagination', { defaultValue: {} }) pagination: PaginationArgs,
  ) {
    return this.plantsService.findAll(pagination)
  }

  @Query(() => PlantResponse, { name: 'plant' })
  findOne(@Args('id', { type: () => Int }) id: number) {
    return this.plantsService.findById(id)
  }

  @Mutation(() => PlantResponse)
  createPlant(@Args('input') input: CreatePlantInput) {
    return this.plantsService.create(input)
  }

  @Mutation(() => PlantResponse)
  updatePlant(@Args('input') input: UpdatePlantInput) {
    return this.plantsService.update(input)
  }

  @Mutation(() => PlantResponse)
  removePlant(@Args('id', { type: () => Int }) id: number) {
    return this.plantsService.remove(id)
  }
}
