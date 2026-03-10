import { Field, ObjectType } from '@nestjs/graphql'

import { PaginatedResponseBase } from '@common/pagination'
import { Client } from '../entities'

@ObjectType({ description: 'Paginated list of clients' })
export class PaginatedClientsResponse extends PaginatedResponseBase {
  @Field(() => [Client], { description: 'List of clients' })
  data: Client[]
}
