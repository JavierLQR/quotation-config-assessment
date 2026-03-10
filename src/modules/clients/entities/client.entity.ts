import { ObjectType, Field, Int, Float } from '@nestjs/graphql'

import { pricingStrategy } from '../../../common/enums'

@ObjectType()
export class Client {
  @Field(() => Int)
  id: number

  @Field()
  name: string

  @Field(() => Int)
  clientTypeId: number

  @Field(() => Float, { nullable: true })
  basePrice?: number | null

  @Field(() => pricingStrategy, { nullable: true })
  pricingStrategy?: string | null

  @Field()
  createdAt: Date

  @Field()
  updatedAt: Date
}
