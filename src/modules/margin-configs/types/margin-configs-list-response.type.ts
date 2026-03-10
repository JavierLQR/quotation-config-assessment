import { Field, ObjectType } from '@nestjs/graphql'

import { PayloadBase } from '@common/responses'
import { MarginConfig } from '../entities'

@ObjectType({ description: 'List of margin configs response' })
export class MarginConfigsListResponse extends PayloadBase {
  @Field(() => [MarginConfig], { description: 'List of margin configs' })
  data: MarginConfig[]
}
