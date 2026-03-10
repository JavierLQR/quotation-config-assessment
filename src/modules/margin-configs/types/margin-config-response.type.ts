import { Field, ObjectType } from '@nestjs/graphql'

import { PayloadBase } from '@common/responses'
import { MarginConfig } from '../entities'

@ObjectType({ description: 'Single margin config response' })
export class MarginConfigResponse extends PayloadBase {
  @Field(() => MarginConfig, {
    nullable: true,
    description: 'Margin config data',
  })
  data?: MarginConfig
}
