import { Field, ObjectType } from '@nestjs/graphql'

import { PaginatedResponseBase } from '@common/pagination'
import { Plant } from '../entities'

@ObjectType({ description: 'Paginated list of plants' })
export class PaginatedPlantsResponse extends PaginatedResponseBase {
  @Field(() => [Plant], { description: 'List of plants' })
  data: Plant[]
}
