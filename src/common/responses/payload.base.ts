import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType({ isAbstract: true })
export abstract class PayloadBase {
  @Field({ description: 'Response message' })
  message: string

  @Field({ description: 'Response status' })
  status: string

  @Field({ description: 'Whether the request was successful' })
  success: boolean
}
