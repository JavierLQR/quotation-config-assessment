import { ObjectType, Field, Int } from '@nestjs/graphql'

@ObjectType()
export class Plant {
  @Field(() => Int)
  id: number

  @Field()
  name: string

  @Field()
  createdAt: Date

  @Field()
  updatedAt: Date
}
