import { ObjectType, Field, Int, Float } from '@nestjs/graphql'

import { pricingStrategy } from '../../../common/enums'

@ObjectType()
export class ClientType {
  @Field(() => Int)
  id: number

  @Field()
  name: string

  @Field(() => Float)
  basePrice: number

  @Field(() => pricingStrategy)
  pricingStrategy: string

  @Field()
  createdAt: Date

  @Field()
  updatedAt: Date
}
