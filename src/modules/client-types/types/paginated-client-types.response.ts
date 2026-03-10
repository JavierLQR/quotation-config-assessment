import { Field, ObjectType } from '@nestjs/graphql'

import { PaginatedResponseBase } from '@common/pagination'
import { ClientType } from '../entities'

@ObjectType({ description: 'Paginated list of client types' })
export class PaginatedClientTypesResponse extends PaginatedResponseBase {
  @Field(() => [ClientType], { description: 'List of client types' })
  data: ClientType[]
}
