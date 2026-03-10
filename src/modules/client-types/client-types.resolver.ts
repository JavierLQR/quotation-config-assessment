import { Args, Int, Mutation, Query, Resolver } from '@nestjs/graphql'

import { PaginationArgs } from '@common/pagination'

import { ClientTypesService } from './client-types.service'
import { CreateClientTypeInput, UpdateClientTypeInput } from './dto'
import { ClientType } from './entities'
import { ClientTypeResponse, PaginatedClientTypesResponse } from './types'

@Resolver(() => ClientType)
export class ClientTypesResolver {
  constructor(private readonly clientTypesService: ClientTypesService) {}

  @Query(() => PaginatedClientTypesResponse, {
    name: 'clientTypes',
    description: 'Get paginated list of client types',
  })
  findAllClientTypes(
    @Args('pagination', { defaultValue: {} }) pagination: PaginationArgs,
  ) {
    return this.clientTypesService.findAll(pagination)
  }

  @Query(() => ClientTypeResponse)
  findOneClientType(@Args('id', { type: () => Int }) id: number) {
    return this.clientTypesService.findById(id)
  }

  @Mutation(() => ClientTypeResponse)
  createClientType(@Args('input') input: CreateClientTypeInput) {
    return this.clientTypesService.create(input)
  }

  @Mutation(() => ClientTypeResponse)
  updateClientType(@Args('input') input: UpdateClientTypeInput) {
    return this.clientTypesService.update(input)
  }

  @Mutation(() => ClientTypeResponse)
  removeClientType(@Args('id', { type: () => Int }) id: number) {
    return this.clientTypesService.remove(id)
  }
}
