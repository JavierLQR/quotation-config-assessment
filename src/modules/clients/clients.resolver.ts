import { Args, Int, Mutation, Query, Resolver } from '@nestjs/graphql'

import { PaginationArgs } from '@common/pagination'

import { ClientsService } from './clients.service'
import { CreateClientInput, UpdateClientInput } from './dto'
import { Client } from './entities'
import {
  ClientResponse,
  ClientsListResponse,
  PaginatedClientsResponse,
} from './types'

@Resolver(() => Client)
export class ClientsResolver {
  constructor(private readonly clientsService: ClientsService) {}

  @Query(() => PaginatedClientsResponse, {
    name: 'clients',
    description: 'Get paginated list of clients',
  })
  findAll(
    @Args('pagination', { defaultValue: {} }) pagination: PaginationArgs,
  ) {
    return this.clientsService.findAll(pagination)
  }

  @Query(() => ClientResponse, { name: 'client' })
  findOne(@Args('id', { type: () => Int }) id: number) {
    return this.clientsService.findById(id)
  }

  @Query(() => ClientsListResponse, {
    name: 'clientsByType',
    description: 'Get clients filtered by client type',
  })
  findByType(@Args('clientTypeId', { type: () => Int }) clientTypeId: number) {
    return this.clientsService.findByClientTypeId(clientTypeId)
  }

  @Mutation(() => ClientResponse)
  createClient(@Args('input') input: CreateClientInput) {
    return this.clientsService.create(input)
  }

  @Mutation(() => ClientResponse)
  updateClient(@Args('input') input: UpdateClientInput) {
    return this.clientsService.update(input)
  }

  @Mutation(() => ClientResponse)
  removeClient(@Args('id', { type: () => Int }) id: number) {
    return this.clientsService.remove(id)
  }
}
