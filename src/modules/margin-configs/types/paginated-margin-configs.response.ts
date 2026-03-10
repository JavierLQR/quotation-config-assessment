import { Field, ObjectType } from '@nestjs/graphql'

import { PaginatedResponseBase } from '@common/pagination'
import { MarginConfig } from '../entities'

@ObjectType({ description: 'Paginated list of margin configs' })
export class PaginatedMarginConfigsResponse extends PaginatedResponseBase {
  @Field(() => [MarginConfig], { description: 'List of margin configs' })
  data: MarginConfig[]
}
