import { ObjectType, Field, Int, Float } from '@nestjs/graphql'

import { volumeRange } from '@app/common/enums'

@ObjectType()
export class MarginConfig {
  @Field(() => Int)
  id: number

  @Field(() => Int)
  plantId: number

  @Field(() => Int, { nullable: true })
  clientTypeId?: number | null

  @Field(() => Int, { nullable: true })
  clientId?: number | null

  @Field(() => volumeRange)
  volumeRange: string

  @Field(() => Float)
  margin: number

  @Field()
  createdAt: Date

  @Field()
  updatedAt: Date
}
